function interpExpression(state, e){
    if(e.kind === 'number' || e.kind === 'boolean'){
      return e.value;
    }else if(e.kind === 'operator'){
      let v1 = interpExpression(state, e.e1);
      let v2 = interpExpression(state, e.e2);
      if(typeof(v1) !== typeof(v2)){
        console.log("Asertion Failed Value 1 is of type '" + typeof(v1) + "'. Value 2 is of type '" + typeof(v2)+"'.");
      }
      assert(typeof(v1) === typeof(v2));
      switch(e.op){
        case '+':{
          return v1+v2;
          break;
        }
        case '-':{
          return v1-v2;        
          break;
        }
        case '*':{
          return v1*v2;
          break;
        }
        case '/':{
          return v1/v2;
          break;
        }
        case '&&':{
          if(typeof(v1) === 'boolean' && typeof(v2) === 'boolean'){
            return v1 && v2;
          }
          console.log("The '&&' operator can only be used with boolean values. Value 1 is of type '" + typeof(v1) + "'. Value 2 is of type '" + typeof(v2)+"'."); 
          break;
        }
        case '||':{
          if(typeof(v1) === 'boolean' && typeof(v2) === 'boolean'){
            return v1 || v2;
          }
          console.log("The '||' operator can only be used with boolean values. Value 1 is of type '" + typeof(v1) + "'. Value 2 is of type '" + typeof(v2)+"'."); 
          break;
        }
        case '<':{
          return v1 < v2;
          break;
        }
        case '>':{
          return v1 > v2;
          break;
        }
        case '===':{
          return v1 === v2;
          break;
        }
      }
    }else if(e.kind === 'variable'){
      if(state.hasOwnProperty(e.name) === true){
        return lib220.getProperty(state,e.name).value;
      }else if(state.outer.hasOwnProperty(e.name) === true){
        return lib220.getProperty(state.outer, e.name).value;
      }else if(state.outer.outer.hasOwnProperty(e.name) === true){
        return lib220.getProperty(state.outer.outer, e.name).value;
      }else if(state.outer.outer.outer.hasOwnProperty(e.name) === true){
        return lib220.getProperty(state.outer.outer.outer, e.name).value;
      }else if(state.outer.outer.outer.outer.hasOwnProperty(e.name) === true){
        return lib220.getProperty(state.outer.outer.outer.outer, e.name).value;
      }
    }else{
      console.log("Error: Not a number or operator");
      assert(false);
    }
  }
  
  function interpStatement(state,s){
    switch(s.kind){
      case 'assignment':{
        if(state.hasOwnProperty(s.name) === true){
          let value = interpExpression(state, s.expression);
          lib220.setProperty(state,s.name,value);
        }else if(state.outer.hasOwnProperty(s.name) === true){
          let value = interpExpression(state.outer, s.expression);
          lib220.setProperty(state.outer,s.name,value);
        }else if(state.outer.outer.hasOwnProperty(s.name) === true){
          let value = interpExpression(state.outer.outer, s.expression);
          lib220.setProperty(state.outer.outer,s.name,value);
        }else if(state.outer.outer.outer.hasOwnProperty(s.name) === true){
          let value = interpExpression(state.outer.outer.outer, s.expression);
          lib220.setProperty(state.outer.outer.outer,s.name,value);
        }else if(state.outer.outer.outer.outer.hasOwnProperty(s.name) === true){
          let value = interpExpression(state.outer.outer.outer.outer, s.expression);
          lib220.setProperty(state.outer.outer.outer.outer,s.name,value);
        }else{
          console.log("Variable '" + s.name + "' was never declared.");
          assert(false);
        }
        return state;
        break;
      } 
      case 'let':{
        let value = interpExpression(state, s.expression);;
        lib220.setProperty(state ,s.name, value);
        return state;
        break;
      }
      case 'if':{
        let value = interpExpression(state, s.test);
        if(value){
          interpBlock(state,s.truePart);
        }else{
          interpBlock(state, s.falsePart);
        }
        return state;
        break;
      }
      case 'while':{
        while(interpExpression(state,s.test)){
          interpBlock(state,s.body);
        }
        return state;
        break;
      }
      case 'print':{
        
        console.log(interpExpression(state,s.expression));
        break;
      }
    }
  }
  function interpBlock(state,b){
    let newState = {outer: state};
    b.reduce((newState,s)=>interpStatement(newState,s),newState);
    return state;
  }
  function interpProgram(p){
    let arr = {};
    let a = p.reduce((arr,s)=>interpStatement(arr,s),arr);
    return a;
  }
  //let r = interpExpression({x:10}, parser.parseExpression("x * 2").value);
  //console.log(r);
  //let st = parser.parseProgram("let x = 9; let i = 0; if(i===0){print(x);}").value;
  let st = parser.parseProgram("let x = 9; let y = 20; if(x===9){ let z = 10;} print(y);");
  console.log(st);
  
  console.log(interpProgram(st));
  //console.log(st);
  //console.log(interpExpression({x: 10, y: 2},a));
  //console.log(typeof(1));
  
  
  