import pandas as pd
import numpy as np

# Parameters
num_users = 5000
min_consumption = 800  # Minimum consumption value
max_consumption = 1200  # Maximum consumption value

# Generate random consumption data
np.random.seed(42)  # For reproducibility
consumption_values = np.random.randint(min_consumption, max_consumption + 1, num_users)

# Create the dataset
users_data = pd.DataFrame({
    'user_id': range(1, num_users + 1),
    'consumption': consumption_values
})

# Save to CSV
users_data.to_csv('new_data.csv', index=False)

print("Dataset created and saved as 'energy_consumption_500_users.csv'")
