var dataLoad = new DataLoader();

dataLoad.LoadCelanVariation("127.0.0.1:8000/get_celan_variation");
data = dataLoad.getCelanVariation();
console.log(data);
