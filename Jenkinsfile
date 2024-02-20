pipeline{
  agent any

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
