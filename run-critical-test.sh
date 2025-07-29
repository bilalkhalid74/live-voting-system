#!/bin/bash

echo "🧪 Running Critical localStorage Test..."
echo "======================================"
echo ""

# Run the critical localStorage test
npm run test:critical

echo ""
echo "======================================"
echo "✅ Critical test completed!"
echo ""
echo "This test validates:"
echo "• Vote button disables after voting"
echo "• Vote state persists after page reload"
echo "• Multiple contestants vote states work independently"
echo "• localStorage is properly read and written"
echo ""
echo "To run in watch mode: npm run test:critical:watch"
echo "To run all tests: npm run test:all"