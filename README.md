# AI-Based Internship Recommendation System

A full-stack, explainable AI-based web application that provides personalized internship recommendations by matching candidate profiles with internship requirements using machine-learning-based text similarity.

## 📌 Project Overview

Students, especially first-generation learners, often struggle to identify suitable internships from long and complex listings.  
This project addresses the problem by recommending **3–5 relevant internships** based on a candidate’s education, skills, interests, and location preferences.

The system is lightweight, explainable, and designed for real-world deployment scenarios such as government or educational portals.


## 🚀 Key Features

- Personalized internship recommendations using machine learning  
- Content-based recommendation engine (TF-IDF + cosine similarity)  
- Explainable AI (XAI) with visual match scores and natural-language explanations  
- Interactive UI with skill selectors, interest icons, and confidence meters  
- Animated AI match progress ring with percentage score  
- Downloadable AI match report for transparency  
- RESTful backend architecture  


## 🧠 How the AI Works

1. User profile and internship details are converted into textual representations  
2. TF-IDF vectorization assigns importance to meaningful keywords  
3. Cosine similarity computes similarity scores between profiles and internships  
4. Internships are ranked based on similarity scores  
5. Top recommendations are returned with explanations and visual indicators  


## 🧩 System Architecture

Frontend (HTML, CSS, JavaScript)
↓
REST API (Flask)
↓
AI Recommendation Engine (TF-IDF + Cosine Similarity)
↓
Database (MySQL)


## 🛠️ Tech Stack
### Frontend
- HTML  
- CSS (Glassmorphism UI)  
- JavaScript  

### Backend
- Python  
- Flask (REST API)  

### Database
- MySQL  

### Machine Learning
- TF-IDF Vectorization  
- Cosine Similarity  
- Content-Based Recommendation System  


## 📂 Project Structure

internship_recommender/
│
├── app.py
├── db_config.py
├── requirements.txt
│
├── templates/
│ └── index.html
│
├── static/
│ ├── style.css
│ └── script.js
│
└── database/
└── schema.sql


