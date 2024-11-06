"use client";
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem
} from '@/components/ui/select';
interface Prediction {
    prediction: number;
    probability?: number; // Optional, if your API returns this
}

const DiabetesPredictor = () => {
    const [formData, setFormData] = useState({
        model_type: '', // Default model type
        age: '',
        glucose: '',
        insulin: '',
        bmi: ''
    });

    const [prediction, setPrediction] = useState<Prediction | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('https://diabetesapi-2knl.onrender.com/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model_type: formData.model_type,
                    age: Number(formData.age),
                    glucose: Number(formData.glucose),
                    insulin: Number(formData.insulin),
                    bmi: Number(formData.bmi),
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('API Error Response:', errorData);
                throw new Error(errorData.message || 'Failed to get prediction');
            }

            const data = await response.json();
           // console.log('Prediction Data:', data);

            if (data && typeof data.prediction !== 'undefined') {
                setPrediction(data);
            } else {
                throw new Error('Unexpected response structure');
            }
        } catch (err: any) {
            setError(err.message);
            console.error('API Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Diabetes Predictor</CardTitle>
                    <CardDescription>
                        Enter your health metrics to get a diabetes prediction
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                  
                            <div className="space-y-2">
                                <Label htmlFor="age">Age</Label>
                                <Input
                                    id="age"
                                    name="age"
                                    type="number"
                                    placeholder="Enter your age"
                                    value={formData.age}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="glucose">Glucose Level</Label>
                                <Input
                                    id="glucose"
                                    name="glucose"
                                    type="number"
                                    placeholder="Enter glucose level"
                                    value={formData.glucose}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="insulin">Insulin Level</Label>
                                <Input
                                    id="insulin"
                                    name="insulin"
                                    type="number"
                                    placeholder="Enter insulin level"
                                    value={formData.insulin}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bmi">BMI</Label>
                                <Input
                                    id="bmi"
                                    name="bmi"
                                    type="number"
                                    step="0.1"
                                    placeholder="Enter BMI"
                                    value={formData.bmi}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
    <Label htmlFor="model_type">Model Type</Label>
    <Select
        value={formData.model_type}
        onValueChange={(value) => setFormData(prev => ({ ...prev, model_type: value }))}
        required
    >
        <SelectTrigger id="model_type" className="w-full">
            <SelectValue placeholder="Select Model Type" />
        </SelectTrigger>
        <SelectContent>
            <SelectItem value="naive_bayes">Naive Bayes Based Model</SelectItem>
            <SelectItem value="perceptron">Perceptron Based Model</SelectItem>
        </SelectContent>
    </Select>
</div>
                        </div>
            
                        <Button className="w-full mt-6" type="submit" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                'Get Prediction'
                            )}
                        </Button>
                    </form>
                </CardContent>

                <CardFooter className="flex flex-col">
                    {error && (
                        <Alert variant="destructive" className="mt-4">
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    
                    {prediction && (
                        <Alert className="mt-4" variant={prediction.prediction === 1 ? "default" : "default"}>
                            <AlertTitle>
                               Prediction :
                            </AlertTitle>
                            <AlertDescription>
                                Based on the provided metrics, your diabetes prediction is {prediction.prediction}
                        </AlertDescription>
                        </Alert>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
};

export default DiabetesPredictor;

