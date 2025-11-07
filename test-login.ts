async function testLogin() {
  console.log("Testing login with admin@shantaz.com...")
  
  // First get CSRF token
  const csrfRes = await fetch('http://localhost:3000/api/auth/csrf')
  const csrfData = await csrfRes.json() as { csrfToken: string }
  console.log("CSRF Token:", csrfData.csrfToken)
  
  // Now try to login
  const loginRes = await fetch('http://localhost:3000/api/auth/callback/credentials', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: 'admin@shantaz.com',
      password: 'Admin@123',
      csrfToken: csrfData.csrfToken,
      callbackUrl: 'http://localhost:3000/dashboard',
      json: true,
    }),
  })
  
  console.log("Login Response Status:", loginRes.status)
  console.log("Login Response Headers:", Object.fromEntries(loginRes.headers.entries()))
  
  const loginData = await loginRes.text()
  console.log("Login Response Body:", loginData)
}

testLogin().catch(console.error)
