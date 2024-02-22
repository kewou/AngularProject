pipeline{

  agent any

  stages{

    stage('Clean cache') {
        steps {
            sh 'npm cache clean --force'
        }    
    }

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

    stage ('Nexus Login'){
        steps {            
            sh "./npmLoginToNexus.expect"
        }
    }

    stage('Deploy to Nexus') {
        steps {            
            sh "npm publish"
        }
    }
  }


}
