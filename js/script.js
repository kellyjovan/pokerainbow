// $(document).ready(function(){
//Pokemon Click Handler
  $( "#rainbow > div").click(function(e) {
  var box = $(e.currentTarget);
  var PokeName = box.attr("value");
  localStorage.setItem("player", PokeName);
  localStorage.setItem("color" , box.attr("data-color"));
  window.location = "pokemon_battle.html";
});

var name = localStorage.getItem("player"); 
var color = localStorage.getItem("color");
//Pokemon Api

function getPokemonById(id) {
  var pokemon;
  $.ajax('http://pokemonapi-silenter.rhcloud.com/pokemon/' + id, {
    async: false,
    complete: function(data) {
      pokemon = JSON.parse(data.responseText);
    }
  });
  return pokemon;
}

// pass in the name of a pokemon as a string and this function returns an object with tons of information about the pokemon!
function getPokemonByName(name) {
  var id, uri, pokemon;
  name = name.toLowerCase();
  $.ajax('http://pokemonapi-silenter.rhcloud.com/pokedex/1', {
    async: false,
    complete: function(data) {
      var obj;
      data = JSON.parse(data.responseText);
      obj = _(data.pokemon).find(function(elt){
        return elt.name === name;
      });
      uri = obj.resource_uri;
    }
  });
  id = uri.match(/(\d+)\/$/)[1];
  $.ajax('http://pokemonapi-silenter.rhcloud.com/pokemon/' + id, {
    async: false,
    complete: function(data) {
      pokemon = JSON.parse(data.responseText);
    }
  });
  return pokemon;
}

// pass in a pokemon id to this function and it returns an image URL for the pokemon.
function getPokemonImage(id) {
  var obj;
  id = id + 1;
  $.ajax('http://pokemonapi-silenter.rhcloud.com/sprite/' + id, {
    async: false,
    complete: function(data) {
      obj = JSON.parse(data.responseText);
    }
  });
  return 'http://pokeapi.co' + obj.image;
}

// Sets img based on pokemon id
function setImageAttribute(idStr, imgStr) {
  $('#' + idStr).attr('src', imgStr);
}

//Pokemon Battle Logic
      //Cpu Health Bar
  var cHp = $('#cHp'), 
      cBar = cHp.find('.bar'), 
      cHit = cHp.find('.hit'),
      //User Health Bar
      pHp = $('#pHp'), 
      pBar = pHp.find('.bar'),
      pHit = pHp.find('.hit'),
      // Buttons
      attack_btn = $('#attack') ,
      spec_atk_btn = $('#spec_atk'),
      back_btn = $('#go_back'),
      back_btn_2 = $('#go_back2'),
      item_btn = $('#item'),
      //Menus
      choices = $('.choice_container'),
      comments = $('#comments'),
      item_menu = $('#item_menu'),
      moves_menu = $('#moves_menu'),
      //Items
      potions = $('#heal'),
      atk_buff = $('#atk_buff'),
      def_buff = $('#def_buff'), 
      //Moves
      move_1 = $('#move_1').find('h3'),
      move_2 = $('#move_2').find('h3'),
      move_3 = $('#move_3').find('h3'),
      move_4 = $('#move_4').find('h3');

  comments.hide();
  item_menu.hide();
  moves_menu.hide();

  var pokemons = ["charmander", "dragonite", "pikachu", "bulbasaur", "squirtle", "houndoom", "gastly"];
  var random = Math.floor(Math.random()* pokemons.length);
  var cpu = pokemons[random],
      cpuPokemon = getPokemonByName(cpu),
      userPokemon = getPokemonByName(name),
      cpuMovesList = cpuPokemon.moves,
      userMovesList = userPokemon.moves,
      cpuMoves = [],
      userMoves = [];
  for(var x = 0; x < 4; x++){
    random = Math.floor(Math.random()*cpuMovesList.length);
    cpuMoves.push(cpuMovesList[random]);
    random = Math.floor(Math.random()*userMovesList.length);
    userMoves.push(userMovesList[random]);
  }

  move_1.text(userMoves[0].name);
  move_2.text(userMoves[1].name);
  move_3.text(userMoves[2].name);
  move_4.text(userMoves[3].name);

  var userPokemonId = userPokemon.pkdx_id,
      userPokemonImg = getPokemonImage(userPokemonId),
      cpuPokemonId = cpuPokemon.pkdx_id,
      cpuPokemonImg = getPokemonImage(cpuPokemonId);

  $('#userPokemonImg').attr('src',userPokemonImg);
  $('#cpuPokemonImg').attr('src', cpuPokemonImg)

  //Atk Btn Click Handler
  attack_btn.click(function(){
    var total = cHp.data('total'),
        value = cHp.data('value');
    
    var damage = Math.floor(Math.random()*200);
    var newValue = value - damage;
    // calculate the percentage of the total width
    var hitWidth = (damage / total ) * 100 + "%";
    var barWidth = (newValue / total) * 100 + "%";
    
    // show hit bar and set the width
    cHit.css({'display':'block','width':hitWidth});
    cHp.data('value', newValue);
    
    setTimeout(function(){
      cHit.css({'width': '0'});
      cBar.css('width', barWidth + "%");
    }, 500);
    
    console.log(value, damage, hitWidth);
      if( value < 0){
      comments.find('h3').text('You Win');
      choices.fadeOut(200);
      comments.fadeIn(200);
    } else{
      //Shows Damage on Comments Div
      comments.find('h3').text('You Did ' + damage +' Damage!');
      choices.fadeOut(200);
      comments.fadeIn(200);
      setTimeout(function(){
        //Calls Cpu Atk function after 1200ms
        cpuAtk();
       }, 1200);
      }
  });
  //Cpu Atks
  function cpuAtk(){
    var total = pHp.data('total'),
        value = pHp.data('value');
        console.log(total, value);
    
    var damage = Math.floor(Math.random()*200);
    var newValue = value - damage;
    // calculate the percentage of the total width
    var hitWidth = (damage / total ) * 100 + "%";
    var barWidth = (newValue / total) * 100 + "%";
    
    // show hit bar and set the width
    pHit.css({'display':'block','width':hitWidth});
    pHp.data('value', newValue);
    
    setTimeout(function(){
      pHit.css({'width': '0'});
      pBar.css('width', barWidth + "%");
    }, 500);
    
    console.log(value, damage, hitWidth);
    if( value < 0){
      comments.find('h3').text('You Lose');
    } else{
      comments.find('h3').text('Cpu Did ' + damage +' Damage!');
      comments.delay(1000).fadeOut(200);
      choices.delay(1000).fadeIn(200);
    }
  }
  //Item Btn Click Handler
  item_btn.click(function(){
    item_menu.fadeIn(200);
    choices.fadeOut(200);
  });
  //Potions Btn Click Handler
  potions.click(function(){
    num = potions.data('value');
    if(num > 1){
      num -= 1;
      potions.data('value', num);
      potions.find('h3').text('Potions x' + num); 
    } else {
      potions.fadeOut(1000);
    }
  });
  //Atk Buff Click Handler
  atk_buff.click(function(){
    num = atk_buff.data('value');
    if(num > 1){
      num -= 1;
      atk_buff.data('value', num);
      atk_buff.find('h3').text('Atk Buff x' + num); 
    } else {
      atk_buff.fadeOut(1000);
    }
  })
  //Go Back Btn Click Handler
  back_btn.click(function(){
    choices.fadeIn(200);
    item_menu.fadeOut(200);
  });
  //Spec Atk Btn Click Handler
  spec_atk_btn.click(function(){
    moves_menu.fadeIn(200);
    choices.fadeOut(200);
  })
  back_btn_2.click(function(){
    choices.fadeIn(200);
    moves_menu.fadeOut(200);
  });

// });
