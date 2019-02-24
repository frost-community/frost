cd core
rm -r node_modules
call npm i
cd ..

cd component
rm -r node_modules
call npm i
cd ..

cd migration
rm -r node_modules
call npm i
cd ..

cd component-api
rm -r node_modules
call npm i
cd ..

cd component-webapp
rm -r node_modules
call npm i
cd ..

cd server-core
rm -r node_modules
call npm i
cd ..

cd server
rm -r node_modules
call npm i
cd ..
