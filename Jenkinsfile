pipeline {
    agent any

    environment {
        PROD_SERVER_PORT = credentials('PROD_SERVER_PORT')
        PROD_SERVER_NAME = credentials('PROD_SERVER_NAME')
        PROD_USER = credentials('PROD_USER')
        PROD_PASSWORD = credentials('PROD_PASSWORD')
        TELEGRAM_BOT_TOKEN = credentials('TELEGRAM_BOT_TOKEN')
        TELEGRAM_CHAT_ID = credentials('TELEGRAM_CHAT_ID')
    }

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'master', url: 'https://github.com/poin4003/booking_courts_backend.git'
            }
        }

        stage('Prepare Config') {
            steps {
                withCredentials([file(credentialsId: 'booking_courts_be_env', variable: 'BOOKING_COURTS_BE_ENV')]) {
                    sh 'cp $BOOKING_COURTS_BE_ENV $WORKSPACE/.env'
                }
            }
        }

        stage('Deploy to Production') {
            steps {
                script {
                    echo 'Deploying to Production Server via git pull + pm2...'

                    sh '''
                        echo 'Copying .env to server...'
                        sshpass -p "${PROD_PASSWORD}" scp -P "${PROD_SERVER_PORT}" .env "${PROD_USER}"@${PROD_SERVER_NAME}:/home/pchuy/documents/booking_courts_backend/.env
                    '''

                    sh '''
                        sshpass -p "${PROD_PASSWORD}" ssh -o StrictHostKeyChecking=no -p "${PROD_SERVER_PORT}" "${PROD_USER}"@${PROD_SERVER_NAME} "
                            cd /home/pchuy/documents/booking_court_backend && \
                            git pull origin master && \
                            pm2 reload all
                        "
                    '''
                }
            }
        }

    }

    post {
        success {
            cleanWs()
            sendTelegramMessage("✅ Node.js Build #${BUILD_NUMBER} was successful! ✅")
        }

        failure {
            cleanWs()
            sendTelegramMessage("❌ Node.js Build #${BUILD_NUMBER} failed. ❌")
        }
    }
}

def sendTelegramMessage(String message) {
    withEnv(["MESSAGE=${message}"]) {
        sh '''
        curl -s -X POST https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/sendMessage \
        -d chat_id=$TELEGRAM_CHAT_ID \
        -d text="$MESSAGE"
        '''
    }
}
