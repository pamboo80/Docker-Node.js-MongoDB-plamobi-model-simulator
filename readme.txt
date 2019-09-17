
1. Once the MongoDB server is started, create a DB named "plaMobi" manually as of now. 
   But this can done in docker settings itself. Ref: https://stackoverflow.com/questions/42912755/how-to-create-a-db-for-mongodb-container-on-start-up

To Run:
docker-compose up -d

For Windows Docker Quickstart Terminal:
cd /c/vm/bitbucket/plamobi-model-simulator
https://docs.docker.com/compose/reference/envvars/#/composeconvertwindowspaths
export COMPOSE_CONVERT_WINDOWS_PATHS=1
https://medium.com/@Charles_Stover/fixing-volumes-in-docker-toolbox-4ad5ace0e572
Oracle VM Virtualbox -> Settings
/C:/vm/bitbucket/plamobi-model-simulator/views/ mount to C:\vm\bitbucket\plamobi-model-simulator\views in Settings->Shared Folder
export MSYS_NO_PATHCONV=1