const fs = require('fs');
const path = require('path');
const { extractPdfContent, trainGeminiWithPdf } = require('./ai_utils');

async function testPdfProcessing(pdfPath) {
    try {
        console.log(`Testing PDF processing for: ${pdfPath}`);
        
        // 1. Extract content
        console.log('\n1. Testing content extraction...');
        const pdfContent = await extractPdfContent(pdfPath);
        console.log('Content extracted successfully!');
        console.log('First 200 characters:', pdfContent.substring(0, 200));
        
        // 2. Test Gemini processing
        console.log('\n2. Testing Gemini processing...');
        const result = await trainGeminiWithPdf(pdfContent);
        console.log('Gemini processing successful!');
        console.log('Response:', JSON.stringify(result, null, 2));
        
        return { success: true, message: 'All tests passed!' };
    } catch (error) {
        console.error('Test failed:', error);
        return { success: false, error: error.message };
    }
}

// Usage example:
// You'll need to provide a test PDF path when running this script
const testPdfPath = process.argv[2];
if (!testPdfPath) {
    console.error('Please provide a PDF file path as an argument');
    process.exit(1);
}

testPdfProcessing(testPdfPath)
    .then(result => {
        console.log('\nTest complete:', result);
        process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
        console.error('Test error:', error);
        process.exit(1);
    });
