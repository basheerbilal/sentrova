import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { apiRouter } from './server/apiRouter';
import { initDatabase } from './server/mysql';

dotenv.config();

let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

const SYSTEM_INSTRUCTION = `You are "Sentrova AI", an expert commercial security and 24/7 CCTV surveillance advisor for SENTROVA.
Your role is to assist business owners, store managers, and security directors with active remote CCTV monitoring questions, pricing, CCTV system compatibility, and security best practices.

Key Information about Sentrova:
- **Core Offering**: Active, live-operator 24/7 remote CCTV surveillance and incident deterrence (not passive recording).
- **Transparent Hourly Pricing (No lock-in contracts)**:
  1. **Essential ($1.99/hr)**: Customer theft monitoring, active shoplifting deterrence, instant SMS/phone alerts, encrypted daily shift logs. Ideal for independent shops, newsagents, boutiques.
  2. **Growth ($2.99/hr - MOST POPULAR)**: Customer + staff area monitoring, cash register/till audit watch, stockroom backdoor watch, priority escalation. Ideal for supermarkets, grocery stores, restaurants, apparel retail.
  3. **Ultimate ($5.99/hr)**: Complete facility & perimeter surveillance, 360° coverage, thermal/optical perimeter tripwires, live voice-down audio talk deterrence, incident evidentiary export dossiers for police. Ideal for multi-branch stores, warehouses, car dealerships, commercial depots.
- **Compatibility**: Connects to 99% of existing CCTV hardware (Hikvision, Dahua, Axis, Hanwha/Samsung, Uniview, Swann, Reolink, RTSP, ONVIF, DVR/NVR/Cloud). No expensive hardware replacement is required.
- **Deterrence Technology**: Real-time live audio voice-down broadcast ("Attention: you are under live remote surveillance. Step away from the merchandise"), instant manager WhatsApp/phone notifications within 30 seconds, and police escalation.
- **UK Contact & Operations**:
  - 24/7 Operations Desk Phone: +44 7742 476163
  - Direct WhatsApp: +44 7448 871603
  - Email: monitoring@sentrova.co.uk
  - Free Quote / Security Audit available directly on this website.

Guidance:
- Be concise, professional, reassuring, and security-minded.
- Provide clear answers with bullet points when explaining plans or steps.
- When relevant, encourage the user to click "Get a Quote" or contact the 24/7 operations desk at +44 7742 476163 or via WhatsApp.
- If asked about custom hours, explain that monitoring hours can be scheduled flexibly around peak customer hours, nights, or weekends.`;

async function startServer() {
  await initDatabase();

  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Mount REST API Router (Services, Packages, Quotes, Leads, CRM, Settings, Auth)
  app.use('/api', apiRouter);

  // API Health Endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Chat API Endpoint
  app.post('/api/chat', async (req, res) => {
    try {
      const { messages } = req.body;
      if (!Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: 'Messages array is required' });
      }

      const client = getGeminiClient();

      if (!client) {
        // Fallback response if API key is not configured yet
        const lastUserMsg = messages[messages.length - 1]?.content?.toLowerCase() || '';
        let fallbackText = "Hello! I am Sentrova's 24/7 Security Advisor. We provide live commercial CCTV monitoring starting at just **$1.99/hr** with no lock-in contracts.\n\n- **Essential ($1.99/hr)**: Customer theft & active shoplifting monitoring.\n- **Growth ($2.99/hr - Most Popular)**: Customer + staff register & stockroom monitoring.\n- **Ultimate ($5.99/hr)**: Full facility perimeter & 2-way live voice deterrence.\n\nWe connect to your existing CCTV without replacing any cameras. You can click **Get a Quote** above or contact operations directly at **+44 7742 476163**.";

        if (lastUserMsg.includes('price') || lastUserMsg.includes('cost') || lastUserMsg.includes('plan')) {
          fallbackText = "Our transparent monitoring packages are billed strictly per active monitoring hour with zero lock-in contracts:\n\n- **Essential ($1.99 / hr)**: Shoplifting prevention, instant phone alerts, daily logs.\n- **Growth ($2.99 / hr)**: Most popular for retail; covers customer aisles, till transactions, and stockroom backdoors.\n- **Ultimate ($5.99 / hr)**: Complete 360° coverage, after-hours perimeter protection, and live audio voice-down talk.\n\nWould you like a tailored recommendation for your business?";
        } else if (lastUserMsg.includes('camera') || lastUserMsg.includes('cctv') || lastUserMsg.includes('hardware') || lastUserMsg.includes('hikvision')) {
          fallbackText = "Sentrova is **100% compatible with 99% of existing CCTV systems**! You do **not** need to buy new hardware. We support Hikvision, Dahua, Axis, Uniview, RTSP/ONVIF streams, and standard NVR/DVR setups via encrypted bridge connection.";
        }

        return res.json({ reply: fallbackText });
      }

      // Format conversation history for Gemini API
      const conversationHistory = messages.slice(-8).map((m: { role: string; content: string }) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

      let response;
      try {
        response = await client.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: conversationHistory,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.65,
            maxOutputTokens: 1000,
          },
        });
      } catch (geminiErr: any) {
        console.warn('gemini-3.6-flash failed, trying fallback model:', geminiErr?.message);
        response = await client.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: conversationHistory,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.65,
            maxOutputTokens: 1000,
          },
        });
      }

      const replyText = response?.text || "I'm here to help with your security and monitoring needs. Feel free to ask about our packages or compatibility.";
      return res.json({ reply: replyText });
    } catch (error: any) {
      console.error('Error handling /api/chat:', error);
      return res.json({
        reply: "Thank you for reaching out to Sentrova Security. Our live surveillance monitoring starts at $1.99/hr and connects seamlessly with your existing CCTV cameras. For immediate assistance, you can call our 24/7 Operations Desk at **+44 7742 476163** or click **Get a Quote**.",
      });
    }
  });

  // Vite middleware in dev; static assets in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
