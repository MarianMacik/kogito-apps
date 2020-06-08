@Library('jenkins-pipeline-shared-libraries')_

def CHANGE_AUTHOR = "$ghprbPullAuthorLogin"
def CHANGE_BRANCH = "$ghprbSourceBranch"
def CHANGE_TARGET = "$ghprbTargetBranch"

pipeline {
    agent {
        label 'kie-rhel7 && kie-mem16g'
    }
    tools {
        maven 'kie-maven-3.6.2'
        jdk 'kie-jdk11'
    }
    options {
        buildDiscarder logRotator(artifactDaysToKeepStr: '', artifactNumToKeepStr: '10', daysToKeepStr: '', numToKeepStr: '10')
        timeout(time: 120, unit: 'MINUTES')
    }
    environment {
        MAVEN_OPTS = '-Xms1024m -Xmx4g'
        SONARCLOUD_TOKEN = credentials('SONARCLOUD_TOKEN')
    }
    stages {
        stage('Prepare') {
            steps {
                sh "export XAUTHORITY=$HOME/.Xauthority"
                sh "chmod 600 $HOME/.vnc/passwd"
            }
        }
        stage('Build kogito-runtimes') {
            steps {
                dir("kogito-runtimes") {
                    script {
                        githubscm.checkoutIfExists('kogito-runtimes', "$CHANGE_AUTHOR", "$CHANGE_BRANCH", 'kiegroup', "$CHANGE_TARGET", true)
                        maven.runMavenWithSubmarineSettings('clean install', false)
                    }
                }
            }
        }
        stage('Build kogito-apps') {
            steps {
                dir("kogito-apps") {
                    script {
                        githubscm.checkoutIfExists('kogito-apps', "$CHANGE_AUTHOR", "$CHANGE_BRANCH", 'kiegroup', "$CHANGE_TARGET", true)
                        maven.runMavenWithSubmarineSettings('clean install -Prun-code-coverage', false)
                        maven.runMavenWithSubmarineSettings('-e -nsu validate -Psonarcloud-analysis', false)
                    }
                }
            }
        }
        stage('Build kogito-examples') {
            steps {
                dir("kogito-examples") {
                    script {
                        githubscm.checkoutIfExists('kogito-examples', "$CHANGE_AUTHOR", "$CHANGE_BRANCH", 'kiegroup', "$CHANGE_TARGET", true)
                        maven.runMavenWithSubmarineSettings('clean install', false)
                    }
                }
                // Use a separate dir for persistence to not overwrite the test results
                dir("kogito-examples-persistence") {
                    script {
                        githubscm.checkoutIfExists('kogito-examples', "$CHANGE_AUTHOR", "$CHANGE_BRANCH", 'kiegroup', "$CHANGE_TARGET", true)
                        // Don't run with tests so far, see: https://github.com/quarkusio/quarkus/issues/6885
                        maven.runMavenWithSubmarineSettings('clean install -Ppersistence', true)
                    }
                }
            }
        }
    }
    post {
        unstable {
            script {
                mailer.sendEmailFailure()
            }
        }
        failure {
            script {
                mailer.sendEmailFailure()
            }
        }
        always {
            archiveArtifacts artifacts: 'kogito-apps/management-console/target/*-runner.jar, kogito-apps/data-index/data-index-service/target/*-runner.jar, kogito-apps/jobs-service/target/*-runner.jar', fingerprint: true
            junit '**/**/junit.xml'
            junit '**/target/surefire-reports/**/*.xml, **/target/failsafe-reports/**/*.xml'
            cleanWs()
        }
    }
}
