#!/bin/bash
echo ""
echo "  🌍 WANDR — Adventure Travel Planner v2.0"
echo "  ─────────────────────────────────────────"
echo ""
echo "  Make sure:"
echo "  1. MongoDB is running (local or Atlas)"  
echo "  2. backend/.env is configured (Resend API key + MongoDB URI)"
echo ""
echo "  Starting servers..."
echo ""

cd backend && npm run dev &
sleep 2
cd ../frontend && npm run dev &

echo "  ✅ Frontend: http://localhost:3000"
echo "  ✅ Backend:  http://localhost:5000"
echo ""
echo "  Press Ctrl+C to stop"
wait
