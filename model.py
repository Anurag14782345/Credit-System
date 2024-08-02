import pandas as pd
from sklearn.preprocessing import MinMaxScaler
import tensorflow as tf
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Input, Dense
from sklearn.neighbors import NearestNeighbors
import pickle

# Load the dataset
data = pd.read_csv('data.csv')  # Ensure your dataset is in this format: user_id, consumption

# Normalize the consumption values to [0, 1] range
scaler = MinMaxScaler()
data['consumption_normalized'] = scaler.fit_transform(data[['consumption']])

# Create features and labels
X = data['consumption_normalized'].values.reshape(-1, 1)

# Define the Autoencoder
input_dim = X.shape[1]
encoding_dim = 2  # Compress the input into 2 dimensions

input_layer = Input(shape=(input_dim,))
encoded = Dense(encoding_dim, activation='relu')(input_layer)
decoded = Dense(input_dim, activation='sigmoid')(encoded)

autoencoder = Model(input_layer, decoded)

# Compile the Autoencoder
autoencoder.compile(optimizer='adam', loss='mean_squared_error')

# Train the Autoencoder
autoencoder.fit(X, X, epochs=50, batch_size=10, shuffle=True, validation_split=0.2)

# Create the encoder model
encoder = Model(input_layer, encoded)

# Encode the consumption data
encoded_data = encoder.predict(X)

# Use NearestNeighbors to find the closest matches
nbrs = NearestNeighbors(n_neighbors=2, algorithm='auto').fit(encoded_data)
distances, indices = nbrs.kneighbors(encoded_data)

# Create recommendations
recommendations = []
for i in range(len(data)):
    if data.iloc[i]['consumption'] < 1000:
        # Check if the recommended user is not the same as the seller
        recommended_idx = indices[i][1] if distances[i][1] > 0 else indices[i][0]
        recommended_user_id = data.iloc[recommended_idx]['user_id']
        recommendations.append((data.iloc[i]['user_id'], recommended_user_id))

# Convert recommendations to DataFrame
recommendations_df = pd.DataFrame(recommendations, columns=['seller_id', 'buyer_id'])
print(recommendations_df)

# Save the model and scaler
autoencoder.save(r'C:\Users\prash\OneDrive\Desktop\cognizant\autoencoder_model.h5')
encoder.save(r'C:\Users\prash\OneDrive\Desktop\cognizant\encoder_model.h5')
scaler_filename = r"C:\Users\prash\OneDrive\Desktop\cognizant\scaler.save"
pickle.dump(scaler, open(scaler_filename, 'wb'))
