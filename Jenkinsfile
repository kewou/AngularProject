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

stage('Increment version') {
    steps {
        script {
            // Vérifie l'état de la branche
            sh 'git status'

            // Incrémente la version (par exemple, patch)
            sh 'npm version patch'

            // Récupère le nom de la branche actuelle
            def branchName = sh(script: 'git rev-parse --abbrev-ref HEAD', returnStdout: true).trim()

            // Pousse les changements de version et le tag dans le dépôt Git
            sh "git push origin ${branchName} --tags"
        }
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
