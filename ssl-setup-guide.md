# SSL Setup Guide for saba.imjd.asia

## Method 1: Cloudflare SSL (Recommended - Free & Easy)

### Step 1: Sign Up for Cloudflare
1. Go to https://www.cloudflare.com/
2. Create a free account
3. Add your domain `imjd.asia`

### Step 2: Update Nameservers
1. In Cloudflare, you'll get nameservers like:
   - `anna.ns.cloudflare.com`
   - `bob.ns.cloudflare.com`
2. Go to your domain registrar (where you bought imjd.asia)
3. Update the nameservers to use Cloudflare's nameservers

### Step 3: Configure DNS
1. In Cloudflare DNS settings, add/verify these records:
   ```
   Type: A
   Name: saba
   Value: 64.31.22.34
   Proxy: ON (orange cloud)
   ```

### Step 4: Enable SSL
1. Go to SSL/TLS tab in Cloudflare
2. Set SSL/TLS encryption mode to "Flexible" or "Full"
3. Enable "Always Use HTTPS"
4. Enable "Automatic HTTPS Rewrites"

### Step 5: Wait for Propagation
- Changes can take 24-48 hours to fully propagate
- You should see the site secure within a few hours

## Method 2: Through Your Hosting Provider

### For cPanel Users:
1. Login to cPanel
2. Find "SSL/TLS" section
3. Click "Let's Encrypt SSL"
4. Select your domain `saba.imjd.asia`
5. Click "Issue" to generate certificate

### For Other Control Panels:
1. Look for "SSL Certificate" or "Security" section
2. Choose "Free SSL" or "Let's Encrypt"
3. Follow the wizard to install

## Method 3: Manual SSL Certificate Purchase

### Popular SSL Certificate Providers:
- Sectigo (formerly Comodo)
- DigiCert
- GoDaddy SSL
- Namecheap SSL

### Steps:
1. Purchase SSL certificate for `saba.imjd.asia`
2. Generate CSR (Certificate Signing Request) through hosting control panel
3. Complete domain validation
4. Install certificate through hosting control panel

## Troubleshooting

### If SSL doesn't work immediately:
1. **Clear browser cache**
2. **Check DNS propagation**: Use https://dnschecker.org/
3. **Wait 24-48 hours** for full propagation
4. **Contact hosting support** if issues persist

### Common Issues:
- **Mixed Content**: Ensure all resources (images, CSS, JS) use HTTPS
- **Redirect Loops**: Check server configuration
- **Certificate Mismatch**: Ensure certificate covers exact domain

## Testing SSL Installation

### Online Tools:
1. https://www.ssllabs.com/ssltest/ - Comprehensive SSL test
2. https://www.whynopadlock.com/ - Check for mixed content issues
3. https://httpstatus.io/ - Check HTTP status codes

### What to Look For:
- Green padlock in browser
- "Secure" or "https://" in address bar
- No browser warnings
- SSL Labs grade A or A+

## Contact Information

If you need help with any of these steps:
- **Email**: ceo@imjd.asia
- **WhatsApp**: +92 300 0747977
- **Website**: https://imjd.asia

## Notes
- Cloudflare method is fastest and most reliable
- Free SSL certificates need renewal (Cloudflare handles this automatically)
- Always backup your site before making SSL changes
