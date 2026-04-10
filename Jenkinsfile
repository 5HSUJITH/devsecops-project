pipeline {
    agent any

    stages {

        stage('Install') {
            steps {
                sh 'ls -l'
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

