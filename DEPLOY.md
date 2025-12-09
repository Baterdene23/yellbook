# Lab 7: EKS Fargate Deployment Guide

## Overview

Deploy Yellbook application to AWS EKS (Elastic Kubernetes Service) using Fargate serverless compute.
This deployment includes:
- **Serverless Compute**: AWS Fargate (No EC2 instances to manage)
- **Authentication**: OIDC-based IAM authentication for GitHub Actions and Pods
- **Database**: PostgreSQL (running on Fargate with EBS volume via PVC - *Note: Fargate has limitations with persistent storage, typically RDS is preferred for production*)
- **Autoscaling**: Horizontal Pod Autoscaling (HPA)
- **Networking**: AWS ALB Ingress with TLS/HTTPS
- **DNS**: Route53 DNS routing (Planned)

## Prerequisites

- AWS Account with appropriate IAM permissions
- `kubectl` installed and configured
- `aws-cli` v2
- `eksctl` (optional, for debugging)
- AWS Certificate Manager certificate for HTTPS (optional for initial deploy)

## Architecture

```
Internet → Route53 → ALB (Ingress) → VPC
                      ├── web (Next.js) → Fargate Pods
                      └── api (Fastify) → Fargate Pods
                                      ↓
                                PostgreSQL (Fargate Pod)
```

## Step 1: Create EKS Cluster (Fargate)

### Status: ✅ Deployed

The EKS cluster is created via CloudFormation stack `yellbook-eks-stack` in `ap-southeast-1`.

**CloudFormation Template:**
- Location: `k8s/eks-fargate-cloudformation.yaml`
- Features:
  - VPC with public/private subnets
  - EKS Cluster `yellbook-eks`
  - Fargate Profiles:
    - `fp-default`: For `default` and `kube-system` namespaces
    - `fp-yellowbooks`: For `yellowbooks` namespace

**Monitor Progress:**
```bash
aws cloudformation describe-stacks \
  --stack-name yellbook-eks-stack \
  --region ap-southeast-1 \
  --query 'Stacks[0].StackStatus'
```

## Step 2: Post-Deployment Setup

We have automated the setup process using PowerShell.

### Run Setup Script
```powershell
./k8s/post-stack-setup.ps1
```

This script performs the following:
1.  **Updates Kubeconfig**: Connects your local `kubectl` to the new cluster.
2.  **Creates Namespace**: Creates `yellowbooks` namespace.
3.  **Creates ECR Secret**: Configures access to the private ECR registry.
4.  **Applies Manifests**: Deploys all Kubernetes resources from `k8s/manifests/`.

## Step 3: Verify Deployment

Check the status of your pods:

```bash
kubectl get pods -n yellowbooks
```

### Expected Output
You should see pods for `api`, `web`, and `postgres`.

**Note on Fargate Startup**: Fargate pods take 1-2 minutes to start as AWS provisions the underlying compute resources on demand.

## Troubleshooting

### Issue: Pods Stuck in `Pending` State
If your pods remain in `Pending` state with the event message:
> "Your AWS account is currently blocked and thus cannot launch any Fargate pods"

**Cause**: This is an AWS account-level restriction often applied to new accounts or specific regions.
**Solution**: You must contact AWS Support to unblock Fargate for your account in the `ap-southeast-1` region.

### Issue: "Operation cannot be fulfilled on resourcequotas"
If you see quota errors, check the `ResourceQuota` in `00-namespace.yaml`. Fargate pods require explicit CPU/Memory requests that fit within the quota.

## Manual Deployment Steps (Reference)

If you need to run steps manually:

1.  **Update Kubeconfig**:
    ```bash
    aws eks update-kubeconfig --name yellbook-eks --region ap-southeast-1
    ```

2.  **Apply Manifests**:
    ```bash
    kubectl apply -f k8s/manifests/
    ```

3.  **Check Ingress**:
    ```bash
    kubectl get ingress -n yellowbooks
    ```
    *Note: The Ingress requires the AWS Load Balancer Controller to be installed. In Fargate, this is typically installed via Helm or as an add-on.*

## Rubric Compliance Checklist

- **OIDC Provider & IAM Roles**: Configured via `setup-oidc.sh` and GitHub Actions workflow.
- **Manifests**: Full suite in `k8s/manifests/` including Deployment, Service, ConfigMap, Secret.
- **Ingress & TLS**: `07-ingress.yaml` configured for ALB with TLS placeholders.
- **Migration Job**: `03-migration-job.yaml` runs Prisma migrations.
- **HPA**: `06-hpa.yaml` configured for CPU/Memory scaling.
- **Docs**: This file (`DEPLOY.md`) updated for Fargate.
