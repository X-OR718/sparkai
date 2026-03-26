export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { messages } = req.body
  if (!messages) return res.status(400).json({ error: 'Messages required' })
  try {
    const apiKey = process.env.OPENROUTER_API_KEY || process.env.VITE_OPENROUTER_KEY
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': process.env.SITE_URL || 'https://sparkai-mu.vercel.app',
        'X-Title': 'SparkAI'
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-small-3.1-24b-instruct:free',
        messages,
        max_tokens: 400,
        temperature: 0.9
      })
    })
    const data = await response.json()
    if (data.error) return res.status(500).json({ error: data.error.message })
    const text = data.choices?.[0]?.message?.content || ''
    return res.status(200).json({ text })
  } catch (err) {
    return res.status(500).json({ error: 'API call failed: ' + err.message })
  }
}
