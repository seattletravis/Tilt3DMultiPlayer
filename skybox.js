// add skybox for room
// let materialArray = [];
// let texture_ft = new THREE.TextureLoader().load( '/tower_images/skybox/space2/redeclipse_ft.png'); //Grab Texture Files Here
// let texture_bk = new THREE.TextureLoader().load( '/tower_images/skybox/space2/redeclipse_bk.png');
// let texture_up = new THREE.TextureLoader().load( '/tower_images/skybox/space2/redeclipse_up.png');
// let texture_dn = new THREE.TextureLoader().load( '/tower_images/skybox/space2/redeclipse_dn.png');
// let texture_rt = new THREE.TextureLoader().load( '/tower_images/skybox/space2/redeclipse_rt.png');
// let texture_lf = new THREE.TextureLoader().load( '/tower_images/skybox/space2/redeclipse_lf.png');
// materialArray.push(new THREE.MeshBasicMaterial( { map: texture_ft })); //add textures to 'materialArray' List
// materialArray.push(new THREE.MeshBasicMaterial( { map: texture_bk }));
// materialArray.push(new THREE.MeshBasicMaterial( { map: texture_up }));
// materialArray.push(new THREE.MeshBasicMaterial( { map: texture_dn }));
// materialArray.push(new THREE.MeshBasicMaterial( { map: texture_rt }));
// materialArray.push(new THREE.MeshBasicMaterial( { map: texture_lf }));
// for (let i = 0; i < 6; i++)
//   materialArray[i].side = THREE.BackSide; //inverse view for skybox to view from inside box
// let skyboxGeo = new THREE.BoxGeometry( 30000, 30000, 30000);
// let skybox = new THREE.Mesh( skyboxGeo, materialArray );
// scene.add( skybox );