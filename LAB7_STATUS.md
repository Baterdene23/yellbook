# Lab 7 EKS Deployment - Current Status

**Date:** December 6, 2025  
**Lab Status:** IN PROGRESS - Cluster Creation Phase  
**Estimated Completion:** 30 minutes  

## ✅ Completed Components

### Infrastructure Setup
- [x] OIDC Provider created in AWS IAM
- [x] GitHub Actions OIDC role configured with trust policy
- [x] CloudFormation template created and fixed for EKS cluster
- [x] VPC, subnets, security groups defined in template
- [x] IAM roles for cluster and node groups configured

### Kubernetes Manifests (Ready for Deployment)
- [x] 00-namespace.yaml - Namespace & ServiceAccount with IRSA
- [x] 01-configmap-secret.yaml - App configuration & secrets
- [x] 02-postgres.yaml - PostgreSQL 16 StatefulSet with 20Gi PVC
- [x] 03-migration-job.yaml - Prisma migration automation
- [x] 04-api-deployment.yaml - Fastify API (2 replicas)
- [x] 05-web-deployment.yaml - Next.js Web (2 replicas)
- [x] 06-hpa.yaml - CPU/Memory-based autoscaling
- [x] 07-ingress.yaml - ALB Ingress with TLS support

### Deployment Scripts
- [x] setup-oidc.sh - OIDC provider configuration
- [x] setup-iam-role.sh - IAM role setup
- [x] setup-github-actions-oidc.sh - GitHub Actions OIDC
- [x] setup-alb-controller.sh - ALB Ingress Controller installation
- [x] post-cluster-deployment.sh - Complete application deployment
- [x] monitor-stack.sh - CloudFormation stack monitoring
- [x] k8s/README.md - Comprehensive documentation

### Documentation
- [x] DEPLOY.md - Step-by-step deployment guide
- [x] k8s/README.md - Kubernetes setup documentation
- [x] Architecture diagrams and explanations
- [x] Troubleshooting guides
- [x] Monitoring and metrics collection instructions

## ⏳ In Progress

### EKS Cluster Creation
**Status:** CloudFormation Stack Creating  
**Timeline:**
- 05:26:18 UTC - Stack creation started
- 05:34:51 UTC - EKS Cluster ✅ CREATE_COMPLETE
- 05:34:52 UTC - NodeGroup CREATE_IN_PROGRESS

**Current Resource Status:**
- VPC ✅
- Subnets (public × 2, private × 2) ✅
- Internet Gateway ✅
- Security Groups ✅
- IAM Roles (Cluster & NodeGroup) ✅
- EKS Cluster ✅
- Node Group ⏳ (10-15 min remaining)

## 📋 Next Steps (In Sequence)

### Step 1: Wait for NodeGroup Creation
```bash
cd k8s
bash monitor-stack.sh
```
Expected: Stack status changes to `CREATE_COMPLETE` (10-15 minutes)

### Step 2: Update Kubeconfig
```bash
aws eks update-kubeconfig \
  --name yellbook-eks \
  --region ap-southeast-1

kubectl cluster-info
kubectl get nodes
```

### Step 3: Install ALB Controller
```bash
bash setup-alb-controller.sh
```
Wait for deployment to rollout successfully.

### Step 4: Deploy Application Manifests
```bash
bash post-cluster-deployment.sh
```
This will:
- Create yellowbooks namespace
- Deploy PostgreSQL
- Run migrations
- Deploy API and Web applications
- Configure HPA

### Step 5: Configure DNS & TLS
```bash
# Get ALB DNS name
kubectl get ingress -n yellowbooks

# Create Route53 ALIAS record pointing to ALB
# Update ACM certificate in ingress (if needed)
```

### Step 6: Verify & Test
```bash
# Check all resources
kubectl get all -n yellowbooks

# Check HPA
kubectl get hpa -n yellowbooks

# Monitor logs
kubectl logs -f deployment/yellbook-api -n yellowbooks
kubectl logs -f deployment/yellbook-web -n yellowbooks

# Access application via HTTPS
curl https://yellbook.example.com  # After DNS setup
```

## 🎯 Lab 7 Rubric - Progress Tracking

| Item | Points | Status | Notes |
|------|--------|--------|-------|
| OIDC/IAM Roles | 20 | ✅ Ready | GitHub + Pod service accounts configured |
| aws-auth/RBAC | 10 | ✅ Ready | ServiceAccount with IRSA annotation |
| K8s Manifests | 25 | ✅ Ready | 7 comprehensive manifest files |
| Ingress/TLS | 20 | ✅ Ready | ALB Ingress with certificate support |
| DB Migration | 10 | ✅ Ready | Kubernetes Job configured |
| HPA | 10 | ✅ Ready | CPU/Memory-based scaling |
| Documentation | 5 | ✅ Ready | Complete DEPLOY.md + k8s/README.md |
| **EKS Cluster** | - | ⏳ 90% | NodeGroup still creating |
| **Total** | **100** | **✅ 90%** | Awaiting cluster completion |

## 📊 Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Route53 + ACM TLS                    │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │          AWS ALB (Load Balancer)                 │  │
│  │     (ALB Ingress Controller Managed)             │  │
│  └──────────────────────────────────────────────────┘  │
│           │                                │            │
│           ├─→ /api/* ─→ yellbook-api       │           │
│           │   (2 Pods)                    │           │
│           │                                │           │
│           └─→ /* ─→ yellbook-web          │           │
│               (2 Pods)                    │           │
│                                │           │           │
└────────────────────────────────┼───────────┼───────────┘
                                 │           │
                    ┌────────────┘           │
                    │                        │
                    ↓                        ↓
         ┌──────────────────┐    ┌──────────────────┐
         │  PostgreSQL      │    │  EBS Storage     │
         │  StatefulSet     │    │  (20Gi PVC)      │
         │  (1 Pod)         │    │                  │
         └──────────────────┘    └──────────────────┘

┌─────────────────────────────────────────────────────────┐
│              HPA (Horizontal Pod Autoscaler)            │
│                                                         │
│  API HPA: min=2, max=5 (CPU 70%, Memory 80%)           │
│  Web HPA: min=2, max=5 (CPU 70%, Memory 80%)           │
└─────────────────────────────────────────────────────────┘
```

## 📋 Deployment Checklist

- [ ] CloudFormation stack reaches CREATE_COMPLETE
- [ ] All EKS resources created (Cluster + NodeGroup)
- [ ] kubectl get nodes returns 2 healthy nodes
- [ ] ALB Controller pods running in kube-system
- [ ] yellowbooks namespace created
- [ ] PostgreSQL pod Running and Ready
- [ ] Migration job completed successfully
- [ ] API deployment scaled to 2 replicas
- [ ] Web deployment scaled to 2 replicas
- [ ] Ingress shows ALB DNS name
- [ ] HTTPS access works with padlock 🔒
- [ ] HPA working (kubectl get hpa -n yellowbooks)
- [ ] API and Web logs show no errors
- [ ] GitHub Actions deploy workflow passes

## 🔍 Monitoring Commands

```bash
# Watch stack creation
while true; do 
  aws cloudformation describe-stacks --stack-name yellbook-eks-stack \
    --region ap-southeast-1 --query 'Stacks[0].StackStatus' --output text
  sleep 30
done

# Watch pod creation
kubectl get pods -n yellowbooks -w

# Watch HPA scaling
kubectl get hpa -n yellowbooks -w

# Check all ingress resources
kubectl get ingress -n yellowbooks -w
```

## 📞 Support & Troubleshooting

See `DEPLOY.md` and `k8s/README.md` for:
- Common error messages
- Log inspection procedures
- Rollback instructions
- Resource cleanup guides

## 🚀 Expected Timeline

| Phase | Duration | Status |
|-------|----------|--------|
| CloudFormation Stack | 20-30 min | ⏳ ~10 min remaining |
| ALB Controller Setup | 5-10 min | ⏹️ After cluster ready |
| Application Deployment | 5-10 min | ⏹️ After ALB ready |
| DNS & TLS Config | 5-10 min | ⏹️ Manual step |
| **Total Estimated** | **50-70 min** | |

---

**Last Updated:** 2025-12-06 05:56 UTC  
**Next Status Check:** 5 minutes  
**Lab 7 Target Completion:** 2025-12-06 14:00 UTC
