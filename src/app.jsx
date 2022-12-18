const React = require("react");
const ReactDOM = require("react-dom/client");
const redux = require("redux");


const reducer = (model = { running: false, time: 0, startTime: 0, results: [], finished: false}, action) => {
    const updates = {
      'START': (model) => ({ ...model, running: true, startTime: !model.time ? new Date() : model.startTime, finished: false}),
      'TICK': (model) => ({ ...model, time: model.running ? new Date() - model.startTime : 0}),
      'INTERVAL': (model) => ({ ...model, running: false, results: [...model.results, model.time], time: 0}),
      'GET_RESULTS': (model) => ({ ...model, running: !model.time ? false : true, finished: !model.time ? true : false}),
      'CLEAR': (model) => ({ ...model, results: !model.time ? [] : model.results}),
    };
    return (updates[action.type] || (() => model))(model);
  };
  
  const container = redux.createStore(reducer);
  
  let view = (m) => {
    let minutes = Math.floor(m.time / 60 / 1000) ;
    let seconds = Math.floor(m.time / 1000);
    let milsec = m.time - (seconds * 1000);
    let secondsFormatted =  `${seconds < 10 ? '0' : ''}${seconds}`;
    let milsecFormatted = `${milsec < 10 ? '0' : ''}${milsec}`;
    let runnersList = m.results?.map((result, index) => {
        let currMin = Math.floor(result / 60 / 1000) ;
        let currSec = Math.floor(result / 1000);
        let currMilSec = result - (currSec * 1000);
        return (
        <div key={index} className="mt-4 flex flex-row">
            <div className="px-2 border-r-2 border-slate-300">Учасник {index + 1}</div>
            <div className="px-2">Час: {`${currMin}:${currSec < 10 ? '0' : ''}${currSec}:${currMilSec}`}</div>
        </div>
        )
    }) 

    let resultsHeader = m.results.length > 0 && m.finished ? 
        <div className="mt-8">
            <h2 className="font-semibold text-lg"> {`${m.results.length > 1 ? `Переміг Учасник ${m.results.indexOf(Math.min(...m.results)) + 1}!` : 'Недостатньо учасників!'}`}</h2>
        </div> : 0;

    let start = (event) => {
      container.dispatch({type:'START'});
    };

    let getResults = (event) => {
        container.dispatch({type:'GET_RESULTS'});
    }

    let interval = (event) => {
        container.dispatch({type:'INTERVAL'});
    }

    let clear = (event) => {
        container.dispatch({type:'CLEAR'});
    }
    

    return <div className="App w-full md:mt-[5%] mt-[10%] flex flex-col justify-center items-center">
                <header>
                    <h1 className='text-2xl font-semibold'>Подивимось, хто пробіг швидше за всіх:</h1>
                </header>

                <div className="mt-6">
                    <button onClick={start} className="py-1 px-2 ml-[-1rem] bg-slate-300 text-slate-700">Старт</button>
                    <button onClick={interval} className="py-1 px-2 ml-4 bg-slate-300 text-slate-700">Інтервал</button>
                    <button onClick={getResults} className="py-1 px-2 ml-4 bg-slate-300 text-slate-700">Отримати результат</button>
                    <button onClick={clear} className="py-1 px-2 ml-4 bg-slate-300 text-slate-700">Скинути</button>
                </div>

                <div className="mt-4"> 
                    {`${minutes}:${secondsFormatted}:${milsecFormatted}`}
                </div>

                <div className="mt-6">
                    {runnersList ? runnersList : <></>}
                </div>

                {resultsHeader ? resultsHeader : <></>}

            </div>
  };

  const root = ReactDOM.createRoot(document.getElementById('app'));

  const render = () => {
    root.render(view(container.getState()));
  };
  
  container.subscribe(render);
  
  setInterval(() => {
    container.dispatch({type:'TICK'});
  }, 1);

