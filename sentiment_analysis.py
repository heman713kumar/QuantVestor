
from textblob import TextBlob
import requests
from bs4 import BeautifulSoup

# Dummy logic using company name, searches recent headlines and performs sentiment scoring
def analyze_sentiment(query: str) -> dict:
    try:
        search_url = f"https://news.google.com/search?q={query}"
        response = requests.get(search_url)
        soup = BeautifulSoup(response.text, 'html.parser')

        headlines = [tag.text for tag in soup.select("article h3")][:5]
        sentiments = []

        for headline in headlines:
            analysis = TextBlob(headline)
            sentiments.append(analysis.sentiment.polarity)

        avg_score = sum(sentiments) / len(sentiments) if sentiments else 0
        return {
            "score": round(avg_score, 3),
            "headlines": headlines,
            "explanation": "Average sentiment score from latest Google News headlines."
        }

    except Exception as e:
        raise ValueError(f"Sentiment analysis failed: {str(e)}")
