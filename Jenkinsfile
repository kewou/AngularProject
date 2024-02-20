pipeline{
  agent any

    environment {
        PATH = "/root/.nvm/versions/node/v19.0.1/bin:${env.PATH}"
    }

  stages{

    stage('Install dependencies') {
        steps {
            sh 'sudo npm install'
        }    
    }

    stage('Build') {
        steps {
            sh 'ng build'
        }
    }
  }


}
