from tensorflow.keras.models import load_model
import pickle
import pandas as pd
from sklearn.neighbors import NearestNeighbors

# Load the models and scaler
autoencoder = load_model('autoencoder_model.h5')
encoder = load_model('encoder_model.h5')
scaler = pickle.load(open("scaler.save", 'rb'))

# Load the original data to fit NearestNeighbors
data = pd.read_csv('new_data.csv')
data['consumption_normalized'] = scaler.transform(data[['consumption']])
X = data['consumption_normalized'].values.reshape(-1, 1)

# Encode the original data
encoded_data = encoder.predict(X)

# Fit the NearestNeighbors model
nbrs = NearestNeighbors(n_neighbors=2, algorithm='auto').fit(encoded_data)

# Preprocess new data
new_data = pd.read_csv('new_data.csv')  # Load new data
new_data['consumption_normalized'] = scaler.transform(new_data[['consumption']])
X_new = new_data['consumption_normalized'].values.reshape(-1, 1)

# Encode the new data
encoded_new_data = encoder.predict(X_new)

# Find nearest neighbors and make recommendations
distances, indices = nbrs.kneighbors(encoded_new_data)

recommendations = []
for i in range(len(new_data)):
    if new_data.iloc[i]['consumption'] < 1000:
        recommended_user_id = data.iloc[indices[i][1]]['user_id']
        recommendations.append((new_data.iloc[i]['user_id'], recommended_user_id))

# Convert to DataFrame and display
recommendations_new_df = pd.DataFrame(recommendations, columns=['seller_id', 'buyer_id'])
print(recommendations_new_df)
