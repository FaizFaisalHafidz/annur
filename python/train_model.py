#!/usr/bin/env python3
"""
Training script untuk KNN model
Sistem Prediksi Jurusan SMA Mathlaul Anwar
"""

import os
import sys
from knn_predictor import KNNPredictor

def train_model():
    """Train the KNN model with different k values"""
    
    # Path to training data
    current_dir = os.path.dirname(os.path.abspath(__file__))
    data_path = os.path.join(current_dir, "data", "training_data.csv")
    
    if not os.path.exists(data_path):
        print(f"Error: Training data not found at {data_path}")
        return
    
    print("=== Training KNN Model untuk Prediksi Jurusan ===\n")
    
    # Test different k values
    k_values = [3, 5, 7]
    best_k = 3
    best_accuracy = 0
    
    for k in k_values:
        print(f"Training with k = {k}...")
        
        knn = KNNPredictor(k=k)
        result = knn.train(data_path)
        
        if result["success"]:
            accuracy = result["accuracy"]
            print(f"Accuracy with k={k}: {accuracy:.4f}")
            
            if accuracy > best_accuracy:
                best_accuracy = accuracy
                best_k = k
                
                # Save the best model
                model_path = os.path.join(current_dir, "data", "knn_model.pkl")
                knn.save_model(model_path)
                print(f"Best model saved with k={k}")
        else:
            print(f"Training failed: {result.get('error', 'Unknown error')}")
        
        print("-" * 50)
    
    print(f"\n=== Training Complete ===")
    print(f"Best k value: {best_k}")
    print(f"Best accuracy: {best_accuracy:.4f}")
    
    # Test prediction with sample data
    print(f"\n=== Testing Prediction ===")
    
    # Load the best model
    knn = KNNPredictor(k=best_k)
    model_path = os.path.join(current_dir, "data", "knn_model.pkl")
    
    if knn.load_model(model_path):
        # Sample student data for testing
        sample_student = {
            "jenis_kelamin": "Laki-laki",
            "matematika": 1,
            "fisika": 1,
            "kimia": 1,
            "biologi": 0,
            "b_indonesia": 0,
            "b_inggris": 1,
            "sejarah": 0,
            "geografi": 0,
            "informatika": 1,
            "seni_budaya": 0,
            "minat_ipa": 0.9,
            "minat_ips": 0.2,
            "minat_bahasa": 0.4,
            "minat_seni": 0.1
        }
        
        print("Testing with sample student data:")
        print(f"Jenis Kelamin: {sample_student['jenis_kelamin']}")
        print(f"Mata Pelajaran Dikuasai: Matematika, Fisika, Kimia, B.Inggris, Informatika")
        print(f"Minat: IPA={sample_student['minat_ipa']}, IPS={sample_student['minat_ips']}, Bahasa={sample_student['minat_bahasa']}, Seni={sample_student['minat_seni']}")
        
        result = knn.predict_single(sample_student)
        
        if result["success"]:
            print(f"\nPrediksi Jurusan: {result['predicted_major']}")
            print(f"Confidence: {result['confidence']:.2f}%")
            print(f"\nTop {len(result['top_predictions'])} Rekomendasi:")
            for pred in result['top_predictions']:
                print(f"{pred['rank']}. {pred['jurusan']} ({pred['confidence']:.2f}%)")
        else:
            print(f"Prediction failed: {result.get('error', 'Unknown error')}")
    
    print(f"\n=== Training and Testing Complete ===")

if __name__ == "__main__":
    train_model()