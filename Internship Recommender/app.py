import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from flask import Flask, render_template, request, jsonify
from db_config import get_connection

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')


# @app.route('/recommend', methods=['POST'])
# def recommend():
#     data = request.json

#     education = data['education']
#     skills = set(data['skills'])
#     interest = data['interest']
#     location = data['location']

#     conn = get_connection()
#     cursor = conn.cursor(dictionary=True)
#     cursor.execute("SELECT * FROM internships")
#     internships = cursor.fetchall()

#     recommendations = []

#     for internship in internships:
#         score = 0

#         if internship['education'] == education:
#             score += 30

#         internship_skills = set(internship['skills'].split(','))
#         score += len(skills.intersection(internship_skills)) * 10

#         if internship['sector'] == interest:
#             score += 20

#         if internship['location'] == location or internship['location'] == "Any":
#             score += 15

#         if score > 0:
#             internship['score'] = score
#             recommendations.append(internship)

#     recommendations = sorted(recommendations, key=lambda x: x['score'], reverse=True)[:5]

#     return jsonify(recommendations)

@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.json

    # Build student profile text
    student_text = (
        data['education'] + " " +
        " ".join(data['skills']) + " " +
        data['interest'] + " " +
        data['location']
    )

    conn = get_connection()
    query = "SELECT * FROM internships"
    df = pd.read_sql(query, conn)

    # Combine internship fields into one text
    df['combined_text'] = (
        df['education'] + " " +
        df['skills'] + " " +
        df['sector'] + " " +
        df['location']
    )

    # TF-IDF Vectorization
    vectorizer = TfidfVectorizer()
    vectors = vectorizer.fit_transform(df['combined_text'].tolist() + [student_text])

    # Similarity calculation
    similarity_scores = cosine_similarity(vectors[-1], vectors[:-1]).flatten()

    df['score'] = similarity_scores

    # Get top 5 recommendations
    top = df.sort_values(by='score', ascending=False).head(5)

    return jsonify(top.to_dict(orient='records'))

if __name__ == '__main__':
    app.run(debug=True)
