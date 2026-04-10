pipeline {
    agent any

    stages {

        stage('Clone') {
            steps {
                git 'https://github.com/5HSUJITH/devsecops-project.git'
            }
        }

        stage('Install') {
            steps {
                sh 'cd app && npm install'
            }
        }

        stage('Build Docker') {
            steps {
                sh 'docker build -t devsecops-app .'
            }
        }

        stage('Run Container') {
            steps {
                sh 'docker run -d -p 3000:3000 devsecops-app || true'
            }
        }
    }
}

