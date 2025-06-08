from flask import Flask, request, render_template, jsonify
from flask_cors import CORS
import numpy as np
import tensorflow as tf

app = Flask(__name__)
CORS(app)

keras_model = tf.keras.models.load_model('my_model.keras')
tflite_interpreter = tf.lite.Interpreter("optimized_model.tflite")
tflite_interpreter.allocate_tensors()
tflite_input_details = tflite_interpreter.get_input_details()
tflite_output_details = tflite_interpreter.get_output_details()

# AI Predictions
@app.route('/')
def home():
    return render_template('ai.html')

@app.route('/predict', methods=['GET'])
def predict():
    try:
        nitrogen = float(request.args.get('nitrogen'))
        phosphorus = float(request.args.get('phosphorus'))
        potassium = float(request.args.get('potassium'))
        temperature = float(request.args.get('temperature'))
        humidity = float(request.args.get('humidity'))
        ph = float(request.args.get('ph'))
        rainfall = float(request.args.get('rainfall'))
        
        input_features = np.array([[nitrogen, phosphorus, potassium, temperature, humidity, ph, rainfall]])
    
        keras_prediction = keras_model.predict(input_features)

        tflite_interpreter.set_tensor(tflite_input_details[0]['index'], np.array(input_features, dtype=np.float32))
        tflite_interpreter.invoke()
        tflite_prediction = tflite_interpreter.get_tensor(tflite_output_details[0]['index'])
        
        agriData = {
            'input': {
                'Nitrogen': nitrogen,
                'Phosphorus': phosphorus,
                'Potassium': potassium,
                'Temperature': temperature,
                'Humidity': humidity,
                'pH': ph,
                'Rainfall': rainfall
            },
            'keras_prediction': keras_prediction[0].tolist(),
            'tflite_prediction': tflite_prediction[0].tolist()
        }
        agriJson = jsonify(agriData)
        agriJson.headers.add('Access-Control-Allow-Origin', '*')
        return agriJson
    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)