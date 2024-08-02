from flask import Flask, render_template, jsonify
from tensorflow.keras.models import load_model
import pickle
import pandas as pd
from sklearn.neighbors import NearestNeighbors

app = Flask(__name__)

# Load the models and scaler
autoencoder = load_model('autoencoder_model.h5')
encoder = load_model('encoder_model.h5')
scaler = pickle.load(open("scaler.save", 'rb'))

# Load the original data and prepare NearestNeighbors
data = pd.read_csv('data.csv')
data['consumption_normalized'] = scaler.transform(data[['consumption']])
X = data['consumption_normalized'].values.reshape(-1, 1)
encoded_data = encoder.predict(X)
nbrs = NearestNeighbors(n_neighbors=2, algorithm='auto').fit(encoded_data)

@app.route('/')
def index():
    # Load new data
    new_data = pd.read_csv('new_data.csv')
    new_data['consumption_normalized'] = scaler.transform(new_data[['consumption']])
    X_new = new_data['consumption_normalized'].values.reshape(-1, 1)

    # Encode new data and find nearest neighbors
    encoded_new_data = encoder.predict(X_new)
    distances, indices = nbrs.kneighbors(encoded_new_data)

    # Prepare recommendations
    recommendations = []
    for i in range(len(new_data)):
        if new_data.iloc[i]['consumption'] < 1000:
            recommended_user_id = data.iloc[indices[i][1]]['user_id']
            recommendations.append({
                'seller_id': new_data.iloc[i]['user_id'],
                'buyer_id': recommended_user_id
            })

    # Render recommendations in HTML
    return render_template('index.html', recommendations=recommendations)

if __name__ == '__main__':
    app.run(debug=True)
