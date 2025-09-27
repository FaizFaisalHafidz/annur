"""
K-Nearest Neighbors (KNN) Algorithm untuk Prediksi Jurusan Kuliah
Sistem Prediksi Jurusan SMA Mathlaul Anwar

Created by: Sistem Annur
Date: 2024
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder, OneHotEncoder
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import joblib
import json
import sys
import os

class KNNPredictor:
    def __init__(self, k=3):
        """
        Initialize KNN Predictor
        
        Args:
            k (int): Number of neighbors to use
        """
        self.k = k
        self.model = KNeighborsClassifier(n_neighbors=k)
        self.scaler = StandardScaler()
        self.gender_encoder = LabelEncoder()
        self.category_encoder = LabelEncoder()
        self.major_encoder = LabelEncoder()
        self.feature_columns = []
        self.is_trained = False
        
    def load_data(self, file_path):
        """
        Load training data from CSV file
        
        Args:
            file_path (str): Path to training data CSV file
            
        Returns:
            pandas.DataFrame: Loaded data
        """
        try:
            data = pd.read_csv(file_path)
            print(f"Data loaded successfully: {len(data)} records")
            return data
        except Exception as e:
            print(f"Error loading data: {str(e)}")
            return None
    
    def preprocess_data(self, data):
        """
        Preprocess the data for training
        
        Args:
            data (pandas.DataFrame): Raw data
            
        Returns:
            tuple: (X, y) - Features and target
        """
        # Create a copy to avoid modifying original data
        df = data.copy()
        
        # Encode categorical variables
        df['jenis_kelamin_encoded'] = self.gender_encoder.fit_transform(df['jenis_kelamin'])
        df['kategori_jurusan_encoded'] = self.category_encoder.fit_transform(df['kategori_jurusan'])
        
        # Define feature columns (excluding nama_lengkap, kategori_jurusan, jurusan_aktual)
        self.feature_columns = [
            'jenis_kelamin_encoded',
            'matematika', 'fisika', 'kimia', 'biologi',
            'b_indonesia', 'b_inggris', 'sejarah', 'geografi',
            'informatika', 'seni_budaya',
            'minat_ipa', 'minat_ips', 'minat_bahasa', 'minat_seni'
        ]
        
        # Extract features
        X = df[self.feature_columns]
        
        # Extract target (jurusan_aktual)
        y = self.major_encoder.fit_transform(df['jurusan_aktual'])
        
        # Scale features
        X_scaled = self.scaler.fit_transform(X)
        
        return X_scaled, y
    
    def train(self, data_path):
        """
        Train the KNN model
        
        Args:
            data_path (str): Path to training data
            
        Returns:
            dict: Training results
        """
        # Load data
        data = self.load_data(data_path)
        if data is None:
            return {"success": False, "error": "Failed to load data"}
        
        # Preprocess data
        X, y = self.preprocess_data(data)
        
        # Split data for validation
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        
        # Train model
        self.model.fit(X_train, y_train)
        self.is_trained = True
        
        # Evaluate model
        y_pred = self.model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        
        # Generate classification report
        unique_labels = sorted(np.unique(y))
        unique_test_labels = sorted(np.unique(y_test))
        unique_pred_labels = sorted(np.unique(y_pred))
        
        print(f"Unique labels in full dataset: {unique_labels}")
        print(f"Unique labels in test set: {unique_test_labels}")
        print(f"Unique labels in predictions: {unique_pred_labels}")
        
        # Use only labels present in test set
        test_pred_labels = sorted(set(y_test) | set(y_pred))
        target_names = [f"Jurusan_{label}" for label in test_pred_labels]
        
        report = classification_report(y_test, y_pred, labels=test_pred_labels, target_names=target_names, output_dict=True)
        
        print(f"Model trained successfully!")
        print(f"Accuracy: {accuracy:.4f}")
        print(f"Number of training samples: {len(X_train)}")
        print(f"Number of test samples: {len(X_test)}")
        
        return {
            "success": True,
            "accuracy": accuracy,
            "n_training_samples": len(X_train),
            "n_test_samples": len(X_test),
            "classification_report": report
        }
    
    def predict_single(self, student_data):
        """
        Predict major for a single student
        
        Args:
            student_data (dict): Student data with required fields
            
        Returns:
            dict: Prediction results
        """
        if not self.is_trained:
            return {"success": False, "error": "Model is not trained yet"}
        
        try:
            # Prepare input data
            input_data = {}
            
            # Encode gender
            if student_data['jenis_kelamin'] in self.gender_encoder.classes_:
                input_data['jenis_kelamin_encoded'] = self.gender_encoder.transform([student_data['jenis_kelamin']])[0]
            else:
                # Default to most common gender if not found
                input_data['jenis_kelamin_encoded'] = 0
            
            # Add academic scores (0 or 1)
            subjects = ['matematika', 'fisika', 'kimia', 'biologi', 'b_indonesia', 
                       'b_inggris', 'sejarah', 'geografi', 'informatika', 'seni_budaya']
            for subject in subjects:
                input_data[subject] = student_data.get(subject, 0)
            
            # Add interest scores (0.0 - 1.0)
            interests = ['minat_ipa', 'minat_ips', 'minat_bahasa', 'minat_seni']
            for interest in interests:
                input_data[interest] = student_data.get(interest, 0.0)
            
            # Create feature vector
            feature_vector = np.array([[input_data[col] for col in self.feature_columns]])
            
            # Scale features
            feature_vector_scaled = self.scaler.transform(feature_vector)
            
            # Make prediction
            prediction = self.model.predict(feature_vector_scaled)[0]
            probabilities = self.model.predict_proba(feature_vector_scaled)[0]
            
            # Get top k predictions with probabilities
            top_k_indices = np.argsort(probabilities)[::-1][:self.k]
            
            predictions = []
            for i, idx in enumerate(top_k_indices):
                major = self.major_encoder.inverse_transform([idx])[0]
                probability = probabilities[idx]
                predictions.append({
                    "rank": i + 1,
                    "jurusan": major,
                    "probability": float(probability),
                    "confidence": float(probability * 100)
                })
            
            # Get predicted major name
            predicted_major = self.major_encoder.inverse_transform([prediction])[0]
            
            # Find nearest neighbors for explanation
            distances, indices = self.model.kneighbors(feature_vector_scaled)
            
            result = {
                "success": True,
                "predicted_major": predicted_major,
                "confidence": float(probabilities[prediction] * 100),
                "top_predictions": predictions,
                "k_value": self.k,
                "nearest_neighbors_count": len(indices[0])
            }
            
            return result
            
        except Exception as e:
            return {"success": False, "error": f"Prediction error: {str(e)}"}
    
    def save_model(self, model_path="knn_model.pkl"):
        """
        Save trained model to file
        
        Args:
            model_path (str): Path to save model
        """
        if not self.is_trained:
            print("Model is not trained yet")
            return False
        
        try:
            model_data = {
                'model': self.model,
                'scaler': self.scaler,
                'gender_encoder': self.gender_encoder,
                'category_encoder': self.category_encoder,
                'major_encoder': self.major_encoder,
                'feature_columns': self.feature_columns,
                'k': self.k
            }
            
            joblib.dump(model_data, model_path)
            print(f"Model saved to {model_path}")
            return True
        except Exception as e:
            print(f"Error saving model: {str(e)}")
            return False
    
    def load_model(self, model_path="knn_model.pkl"):
        """
        Load trained model from file
        
        Args:
            model_path (str): Path to load model from
        """
        try:
            model_data = joblib.load(model_path)
            
            self.model = model_data['model']
            self.scaler = model_data['scaler']
            self.gender_encoder = model_data['gender_encoder']
            self.category_encoder = model_data['category_encoder']
            self.major_encoder = model_data['major_encoder']
            self.feature_columns = model_data['feature_columns']
            self.k = model_data['k']
            self.is_trained = True
            
            print(f"Model loaded from {model_path}")
            return True
        except Exception as e:
            print(f"Error loading model: {str(e)}")
            return False

def main():
    """
    Main function to handle command line arguments
    """
    if len(sys.argv) < 2:
        print("Usage: python knn_predictor.py <action> [parameters]")
        print("Actions:")
        print("  train <data_path> [k] - Train the model")
        print("  predict <student_data_json> - Predict for single student")
        return
    
    action = sys.argv[1]
    
    if action == "train":
        if len(sys.argv) < 3:
            print("Please provide data path for training")
            return
        
        data_path = sys.argv[2]
        k = int(sys.argv[3]) if len(sys.argv) > 3 else 3
        
        # Initialize and train model
        knn = KNNPredictor(k=k)
        result = knn.train(data_path)
        
        if result["success"]:
            # Save model
            model_path = os.path.join(os.path.dirname(data_path), "knn_model.pkl")
            knn.save_model(model_path)
            
            # Output result as JSON
            print(json.dumps(result, indent=2))
        else:
            print(json.dumps(result, indent=2))
    
    elif action == "predict":
        if len(sys.argv) < 3:
            print("Please provide student data JSON for prediction")
            return
        
        try:
            student_data = json.loads(sys.argv[2])
        except json.JSONDecodeError:
            print(json.dumps({"success": False, "error": "Invalid JSON format"}))
            return
        
        # Load model and predict
        knn = KNNPredictor()
        model_path = os.path.join(os.path.dirname(__file__), "data", "knn_model.pkl")
        
        if knn.load_model(model_path):
            result = knn.predict_single(student_data)
            print(json.dumps(result, indent=2))
        else:
            print(json.dumps({"success": False, "error": "Failed to load model"}))
    
    else:
        print(f"Unknown action: {action}")

if __name__ == "__main__":
    main()