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

    stage ('Increment version') {
                // Vérifie d'abord si le répertoire est propre
                sh 'git diff-index --quiet HEAD || (echo "Git working directory not clean" && exit 1)'

                // Incrémente la version (par exemple, patch)
                sh 'npm version patch'

                // Pousse les changements de version et le tag dans le dépôt Git
                sh 'git push origin HEAD --tags'
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
