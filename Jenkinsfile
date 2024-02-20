pipeline{
  agent any

  stages{

    stage('Install dependencies') {
        steps {
            sh 'npm install'
        }    
    }

    stage('Build') {
        steps {
            sh 'ng build'
        }
    }
  }


}
