from flask import Flask
from flask_restful import Resource, Api
from flask_cors import CORS
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import roc_curve
import pandas as pd
import numpy as np

app = Flask(__name__)
CORS(app)
api = Api(app)
    
class ROC(Resource):
    def get(self, preprocessing, c):
        
        # you need to preprocess the data according to user preferences (only fit preprocessing on train data)
        if preprocessing == 'standardize':
            scaler = StandardScaler() 
            scaler.fit(X_train)
            X_train2 = scaler.transform(X_train)
            X_test2 = scaler.transform(X_test)
            
        elif preprocessing == 'minmax_scale':
            scaler = MinMaxScaler()
            scaler.fit(X_train)
            X_train2 = scaler.transform(X_train)
            X_test2 = scaler.transform(X_test)
        
        else:
            X_train2 = X_train
            X_test2 = X_test
        
        
        # fit the model on the training set
        np.random.seed(1)
        clf = LogisticRegression(random_state=0, solver='lbfgs',C = c).fit(X_train2, y_train)
        
        # predict probabilities on test set
        y_prob = [row[1] for row in clf.predict_proba(X_test2)]
        
        fpr, tpr, thresholds = roc_curve(y_test ,y_prob, pos_label = 1)
        
        results = []
        for i in range(len(thresholds)):
            results.append({'fpr':fpr[i], 'tpr':tpr[i], 'thresholds':thresholds[i]})  
        
        
        return (results)

# Here you need to add the ROC resource, ex: api.add_resource(HelloWorld, '/')
api.add_resource(ROC, '/<string:preprocessing>/<float:c>')

if __name__ == '__main__':
    # load data
    url = 'https://raw.githubusercontent.com/velej/velej.github.io/master/data/transfusion.data'
    df = pd.read_csv(url)
    df.columns = ['R','F','M','T','Donated']
    xDf = df.loc[:, df.columns != 'Donated']
    y = df['Donated']
    # get random numbers to split into train and test
    np.random.seed(1)
    r = np.random.rand(len(df))
    # split into train test
    X_train = xDf[r < 0.8]
    X_test = xDf[r >= 0.8]
    y_train = y[r < 0.8]
    y_test = y[r >= 0.8]
    app.run(debug=True)



           
