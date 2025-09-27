#!/usr/bin/env python3
"""
Script untuk prediksi jurusan menggunakan model KNN yang sudah ditraining
Digunakan oleh Laravel controller melalui command line
"""

import sys
import json
import os
from knn_predictor import KNNPredictor

def main():
    """Main function untuk prediksi via command line"""
    
    if len(sys.argv) < 2:
        result = {
            "success": False,
            "error": "Missing input data. Usage: python predict.py '<json_data>'"
        }
        print(json.dumps(result))
        return
    
    try:
        # Parse input JSON
        input_data = json.loads(sys.argv[1])
        
        # Validasi input data
        required_fields = ['jenis_kelamin', 'mata_pelajaran_dikuasai', 'minat_ipa', 'minat_ips', 'minat_bahasa', 'minat_seni']
        for field in required_fields:
            if field not in input_data:
                result = {
                    "success": False,
                    "error": f"Missing required field: {field}"
                }
                print(json.dumps(result))
                return
        
        # Path ke model yang sudah ditraining
        model_path = os.path.join(os.path.dirname(__file__), 'data', 'knn_model.pkl')
        
        if not os.path.exists(model_path):
            result = {
                "success": False,
                "error": "Model file not found. Please train the model first."
            }
            print(json.dumps(result))
            return
        
        # Load model dan lakukan prediksi
        knn = KNNPredictor()
        knn.load_model(model_path)
        
        # Format data untuk prediksi
        student_data = {
            'jenis_kelamin': input_data['jenis_kelamin'],
            'minat_ipa': float(input_data['minat_ipa']),
            'minat_ips': float(input_data['minat_ips']),
            'minat_bahasa': float(input_data['minat_bahasa']),
            'minat_seni': float(input_data['minat_seni'])
        }
        
        # Set mata pelajaran dikuasai (default 0, set 1 for mastered subjects)
        all_subjects = ['matematika', 'fisika', 'kimia', 'biologi', 'b_indonesia', 
                       'b_inggris', 'sejarah', 'geografi', 'informatika', 'seni_budaya']
        
        for subject in all_subjects:
            # Check if subject is in the mastered list (case insensitive)
            mastered_subjects_lower = [s.lower() for s in input_data['mata_pelajaran_dikuasai']]
            if subject.lower().replace('_', ' ') in mastered_subjects_lower or \
               subject.replace('_', ' ').title() in input_data['mata_pelajaran_dikuasai']:
                student_data[subject] = 1
            else:
                student_data[subject] = 0
        
        prediction_result = knn.predict_single(student_data)
        
        if prediction_result['success']:
            # Convert top_predictions to recommendations format
            recommendations = []
            for pred in prediction_result['top_predictions']:
                recommendations.append({
                    'major': pred['jurusan'],
                    'probability': pred['confidence']  # Already in percentage
                })
            
            result = {
                "success": True,
                "data": {
                    "predicted_major": prediction_result['predicted_major'],
                    "confidence": prediction_result['confidence'],
                    "recommendations": recommendations
                }
            }
        else:
            result = {
                "success": False,
                "error": prediction_result['error']
            }
        
        print(json.dumps(result, ensure_ascii=False))
        
    except json.JSONDecodeError:
        result = {
            "success": False,
            "error": "Invalid JSON input"
        }
        print(json.dumps(result))
        
    except Exception as e:
        result = {
            "success": False,
            "error": f"Prediction error: {str(e)}"
        }
        print(json.dumps(result))

if __name__ == "__main__":
    main()