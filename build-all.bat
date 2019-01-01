cd component
rm -r built
call npm run build
cd ..

cd component-api
rm -r built
call npm run build
cd ..

cd component-webapp
rm -r built
call npm run build
cd ..

cd server
rm -r built
call npm run build
cd ..
