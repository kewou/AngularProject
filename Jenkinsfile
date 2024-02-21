pipeline{

  agent any

      environment {
        NEXUS_URL = 'http://172.16.0.4:8081'
        NPM_REGISTRY = "$NEXUS_URL/repository/npmHosted/"
        NPM_USERNAME = 'admin'
        NPM_PASSWORD = 'sonarsbeezy'
    }

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

    stage('Deploy to Nexus') {
        steps {
            sh "npm login --registry $NPM_REGISTRY -u $NPM_USERNAME -p $NPM_PASSWORD"
            sh "npm publish --registry $NPM_REGISTRY"
        }
    }
  }


}
