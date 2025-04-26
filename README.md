# CVOptimizer - Smart Resume Builder

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/yourusername/cv-optimizer)
[![Docker](https://img.shields.io/badge/docker-ready-blue.svg)](https://github.com/yourusername/cv-optimizer/blob/main/docker-compose.yml)

CVOptimizer is an intelligent resume building platform that helps job seekers create ATS-optimized resumes tailored to specific job descriptions. Our application uses AI-powered analysis to increase interview chances and streamline the job application process.

![CVOptimizer Preview](docs/preview.png)

## 🌟 Demo

Check out our live demo: [https://cv-optimizer-demo.vercel.app](https://cv-optimizer-demo.vercel.app)

![Demo GIF](docs/demo.gif)

## ✨ Features

- **Smart Resume Builder** - Create professional resumes with intuitive drag-and-drop interface
- **ATS Optimization** - Ensure your resume passes Applicant Tracking Systems
- **Keyword Analysis** - Match your resume to job descriptions
- **AI Content Suggestions** - Get smart recommendations for skills and achievements
- **Multiple Export Formats** - Download as PDF, DOCX, or plain text
- **Template Selection** - Choose from various professionally-designed templates
- **Secure Data Storage** - Your information is encrypted and protected

## 🚀 Roadmap

- [x] Project setup and core architecture
- [x] Basic resume builder interface
- [x] Template system with multiple designs
- [x] ATS compatibility checker
- [x] Keyword optimization engine
- [x] Content suggestion system
- [x] User accounts and CV storage
- [x] Premium features and subscription model
- [x] Mobile responsive design
- [ ] Enhanced AI suggestions
- [ ] Multilingual support
- [ ] Cover letter generator
- [ ] LinkedIn profile integration
- [ ] Job application tracker

## 🛠️ Tech Stack

- **Frontend**: React, Material UI, Redux
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT, OAuth
- **Deployment**: Docker, AWS/Vercel

## 🏗️ Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn
- MongoDB (local or Atlas)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/cv-optimizer.git
cd cv-optimizer

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see the application.

### Docker Setup

```bash
# Build and run with Docker Compose
docker-compose up -d

# Stop containers
docker-compose down
```

## 📸 Screenshots

### Landing Page
![Landing Page](docs/screenshot-landing.png)

### Dashboard
![Dashboard](docs/screenshot-dashboard.png)

### CV Editor
![CV Editor](docs/screenshot-editor.png)

### Template Selection
![Template Selection](docs/screenshot-templates.png)

### ATS Analysis
![ATS Analysis](docs/screenshot-ats.png)

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 🚢 Deployment

The application is ready for deployment on various platforms:

### Vercel Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### AWS Deployment

Detailed instructions for deploying to AWS can be found in [DEPLOYMENT.md](DEPLOYMENT.md).

## 📖 Documentation

- [API Documentation](docs/API.md)
- [Component Guide](docs/COMPONENTS.md)
- [Deployment Guide](docs/DEPLOYMENT.md)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💖 Sponsorship

CVOptimizer is an open-source project that aims to help job seekers worldwide. If you find this project useful or promising, please consider sponsoring it to help maintain and improve it.

### Why Sponsor?

- **Support Job Seekers**: Your sponsorship helps people craft better resumes and increase their chances of landing jobs.
- **Promote Open Source**: Help maintain a valuable open-source tool in the career development space.
- **Get Recognition**: Sponsors are prominently featured in our README and website.
- **Influence Development**: Premium sponsors can suggest and prioritize new features.

### Sponsorship Tiers

- **Supporter** ($5/month): Name in the README
- **Bronze Sponsor** ($25/month): Small logo in README, Twitter mention
- **Silver Sponsor** ($100/month): Medium logo in README and website, feature suggestions
- **Gold Sponsor** ($500/month): Large logo, feature prioritization, premium support

Sponsor through:
- [GitHub Sponsors](https://github.com/sponsors/yourusername)
- [Open Collective](https://opencollective.com/cv-optimizer)
- [PayPal](https://paypal.me/yourusername)

## 📬 Contact

- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com
- Twitter: [@yourusername](https://twitter.com/yourusername)

---

⭐️ **Star this repo if you find it useful!** ⭐️