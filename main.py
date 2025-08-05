
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from utils.yahoo_scraper import scrape_yahoo_data
from utils.valuation_model import calculate_all_valuations
from utils.sentiment_analysis import analyze_sentiment

app = FastAPI()

# CORS setup for frontend to call backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ValuationRequest(BaseModel):
    url: str

class SentimentRequest(BaseModel):
    query: str

@app.post("/valuation")
async def get_valuation(data: ValuationRequest):
    try:
        stock_data = scrape_yahoo_data(data.url)
        valuation = calculate_all_valuations(stock_data)
        return {"success": True, "data": valuation}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/sentiment")
async def get_sentiment(data: SentimentRequest):
    try:
        score = analyze_sentiment(data.query)
        return {"success": True, "score": score}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
