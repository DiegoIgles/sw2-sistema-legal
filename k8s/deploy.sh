#!/bin/bash

echo "🚀 Desplegando Microservicio de Expedientes en DigitalOcean Kubernetes..."

# Aplicar manifiestos en orden
kubectl apply -f k8s/00-namespace.yaml
kubectl apply -f k8s/01-postgres-pvc.yaml
kubectl apply -f k8s/02-postgres-deployment.yaml
kubectl apply -f k8s/03-postgres-service.yaml
kubectl apply -f k8s/04-secret.yaml
kubectl apply -f k8s/05-configmap.yaml
kubectl apply -f k8s/06-deployment.yaml
kubectl apply -f k8s/07-service.yaml

echo "⏳ Esperando a que los pods estén listos..."
kubectl wait --for=condition=ready pod -l app=expedientes-service -n expedientes --timeout=300s

echo "📊 Estado del deployment:"
kubectl get all -n expedientes

echo "🌐 Obteniendo LoadBalancer IP..."
kubectl get service expedientes-service -n expedientes
