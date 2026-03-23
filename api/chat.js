const https = require('https')

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { messages } = req.body || {}
  if (!messages) return res.status(400).json({ error: 'Messages required' })
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'API key not configured' })
  const body = JSON.stringify({
    model: 'cognitivecomputations/dolphin-mistral-24b-venice-edition:free',
    messages,
    max_tokens: 400,
    temperature: 0.9
  })
  return new Promise((resolve) => {
    const options = {
      hostname: 'openrouter.ai',
      path: '/api/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://sparkai-mu.vercel.app',
        'X-Title': 'SparkAI',
        'Content-Length': Buffer.byteLength(body)
      }
    }
    const request = https.request(options, (response) => {
      let data = ''
      response.on('data', chunk => data += chunk)
      response.on('end', () => {
        try {
          const parsed = JSON.parse(data)
          if (parsed.error) {
            res.status(500).json({ error: parsed.error.message })
          } else {
            const text = parsed.choices?.[0]?.message?.content || 'Hey there!'
            res.status(200).json({ text })
          }
        } catch (e) {
          res.status(500).json({ error: 'Parse error' })
        }
        resolve()
      })
    })
    request.on('error', (e) => {
      res.status(500).json({ error: e.message })
      resolve()
    })
    request.write(body)
    request.end()
  })
}
