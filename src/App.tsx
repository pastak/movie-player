import { useCallback, useRef, useState } from 'react'
import './App.css'
import { FileInfo } from './libs/files'
import { getWindowManagementPermissionState } from './libs/multiWindow'
import { baseUrl } from './libs/baseUrl';

// const techconf2024 = '[{"url":"/video/Helpfeel_community_digest.mp4","id":"17597e1d-98d3-4d5e-95cf-358fa55dadad","type":"video"},{"url":"%2Fslide.html%3Ftype%3Dnotice%26number%3D0","id":"486e4613-34b8-4538-8ca9-453c31de0d51","type":"website"},{"url":"%2Fslide.html%3Ftype%3Dnotice%26number%3D1","id":"1a6b7216-47df-4a1b-9bd6-5ca3c05ef226","type":"website"},{"url":"%2Fslide.html%3Ftype%3Dtimetable","id":"101527be-2117-4e4f-88c7-d7ebc8742e24","type":"website"},{"url":"/video/help-ape01.mp4","id":"99e8bc1e-f85a-49dd-8136-6c81ab26a9ad","type":"video"},{"url":"/video/nishiyama-interview.mp4","id":"9c4e5e4c-14c3-4422-8a71-c709524e2bda","type":"video"},{"url":"%2Fslide.html%3Ftype%3Dnotice%26number%3D0","id":"f21df910-9a75-4008-86f5-6df4b0f809e5","type":"website"},{"url":"%2Fslide.html%3Ftype%3Dnotice%26number%3D1","id":"9d31eaf1-9826-4690-bf06-7c25078c5aea","type":"website"},{"url":"%2Fslide.html%3Ftype%3Dtimetable","id":"bf284ef5-e65b-41e0-96dd-0c84a7c073a7","type":"website"},{"url":"/video/help-ape-EC.mp4","id":"e8ddb908-a220-4b93-af17-42122a0ef273","type":"video"},{"url":"/video/daiiz-interview.mp4","id":"64bad652-d64f-4b0b-8e41-a21aa33ee27f","type":"video"},{"url":"%2Fslide.html%3Ftype%3Dnotice%26number%3D0","id":"68328505-5b77-4499-ade9-97bba748426e","type":"website"},{"url":"%2Fslide.html%3Ftype%3Dnotice%26number%3D1","id":"3e66f35f-a24d-425d-bc2e-090405e2a9aa","type":"website"},{"url":"%2Fslide.html%3Ftype%3Dtimetable","id":"a32de2c1-96e6-4600-bbff-43605579a849","type":"website"},{"url":"/video/help-ape01.mp4","id":"42812d36-7534-4054-81c2-57506ffff4d7","type":"video"},{"url":"/video/pastak-interview.mp4","id":"50dee21b-08c9-4e56-9af8-a073ef7779cb","type":"video"},{"url":"%2Fslide.html%3Ftype%3Dnotice%26number%3D0","id":"9f0b1d90-2167-49ff-8b2a-ec28cca5cf12","type":"website"},{"url":"%2Fslide.html%3Ftype%3Dnotice%26number%3D1","id":"990f72b3-4b43-4334-983e-affb106fbee5","type":"website"},{"url":"%2Fslide.html%3Ftype%3Dtimetable","id":"29092cbb-8425-480e-99a3-93ba5bda43b6","type":"website"}]'

const Preview: React.FC<{
  file: FileInfo
  deleteFile: () => void
}> = ({file, deleteFile}) => {
  if (file.type === 'image') {
    return <img src={file.url} style={{width: 100, height: 100}} onError={() => deleteFile()}/>
  } else if (file.type === 'video') {
    return <video src={file.url} style={{width: 100, height: 100}} onError={(e) => {
      if (e.currentTarget.error?.code === MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED) {
        deleteFile()
      }
    }} muted autoPlay />
  } else if (file.type ==='futa') {
    return <span>蓋ページ</span>
  }else {
    return <span>{file.url}</span>
  }
}

function App() {
  const [files, setFiles] = useState<FileInfo[]>(JSON.parse(localStorage.getItem('data') || '[]') || []);
  const [attackWithVideo, setAttackWithVideo] = useState(false);

  const onChangeFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newInfo: FileInfo[] = [...files].map(f => ({
      url: URL.createObjectURL(f),
      id: crypto.randomUUID(),
      type: f.type.startsWith('image') ? 'image' : f.type.startsWith('video') ? 'video' : 'unknown'
    }));
    setFiles(prev => {
      localStorage.setItem('data', JSON.stringify([...prev, ...newInfo]))
      return [...prev, ...newInfo];
    });
    e.target.value = ''
  }

  const [windowProxy, setWindowProxy] = useState<WindowProxy | null>(null);

  const play = (type: 'primary' | 'secondary') => async () => {
    console.log('play', type)
    try {
      const state = await getWindowManagementPermissionState();
      if (state === 'granted') {
        // @ts-expect-error
        const screens = (await window.getScreenDetails()).screens;
        // @ts-expect-error
        const targetScreen = screens.find(screen => type === 'primary' ? screen.isPrimary : !screen.isPrimary)
        if (!targetScreen) return;
        // await document.body.requestFullscreen({ screen: targetScreen });
        const features = [
          `left=${targetScreen.availLeft}`,
          `top=${targetScreen.availTop}`,
          `width=${targetScreen.availWidth}`,
          `height=${targetScreen.availHeight}`,
          `menubar=no`,
          `toolbar=no`,
          `location=no`,
          `status=no`,
          `resizable=yes`,
          `scrollbars=no`,
          'fullscreen',
        ].join(",");
        const w = window.open(`${baseUrl}player.html?senario=${JSON.stringify(files)}`, Math.random().toString(), features);
        setWindowProxy(w);
        console.log(w)
      }
    } catch (e) {
      console.error(e)
      // nothing
    }
  }

  const textRef = useRef<HTMLInputElement | null> (null);
  const onTextEnter = (e: React.SyntheticEvent) => {
    e.preventDefault()
    if (!textRef.current) return;
    try {
      const url = new URL(textRef.current.value);
      textRef.current.value = '';
      setFiles(prev => {
        const data = [...prev, {
          url: url.toString(),
          id: crypto.randomUUID(),
          type: 'website' as const
        }];
        localStorage.setItem('data', JSON.stringify(data));
        return data;
      });
    } catch {}
  }

  const generateDeleteFunc = (id: string) => () => setFiles(prev => {
    const data = prev.filter(f => f.id !== id);
    localStorage.setItem('data', JSON.stringify(data));
    return data;
  })

  const fileSelectRef = useRef<HTMLSelectElement>(null);
  const handleSelectFile = (e: React.FormEvent) => {
    e.preventDefault()
    if (!fileSelectRef.current) return;
    const name = fileSelectRef.current.value;
    setFiles(prev => {
      const data = [...prev, {
        url: '/video/' + name,
        id: crypto.randomUUID(),
        type: 'video' as const
      }];
      localStorage.setItem('data', JSON.stringify(data));
      return data;
    })
  }
  const handleInsertNotice = (e: React.SyntheticEvent) => {
    e.preventDefault()
    setFiles(prev => {
      const data = [...prev, {
        url: encodeURIComponent(`${baseUrl}slide.html?type=notice&number=0`),
        id: crypto.randomUUID(),
        type: 'website' as const
      },{
        url: encodeURIComponent(`${baseUrl}slide.html?type=notice&number=1`),
        id: crypto.randomUUID(),
        type: 'website' as const
      },{
        url: encodeURIComponent(`${baseUrl}slide.html?type=timetable`),
        id: crypto.randomUUID(),
        type: 'website' as const
      }];
      localStorage.setItem('data', JSON.stringify(data));
      return data;
    })
  }
  const handleInsertSponsors = (e: React.SyntheticEvent) => {
    e.preventDefault()
    setFiles(prev => {
      const data = [...prev, {
        url: 'https://i.gyazo.com/8def829ad21e558068bc068a523df55c.mp4',
        id: crypto.randomUUID(),
        type: 'video' as const
      }];
    // setFiles(prev => {
    //   const data = [...prev, {
    //     url: encodeURIComponent(`${baseUrl}sponsor.html?type=Matz`),
    //     id: crypto.randomUUID(),
    //     type: 'website' as const
    //   },{
    //     url: encodeURIComponent(`${baseUrl}sponsor.html?type=Take`),
    //     id: crypto.randomUUID(),
    //     type: 'website' as const
    //   },{
    //     url: encodeURIComponent(`${baseUrl}sponsor.html?type=Ume`),
    //     id: crypto.randomUUID(),
    //     type: 'website' as const
    //   }];
      localStorage.setItem('data', JSON.stringify(data));
      return data;
    })
  }

  const attackRef = useRef<HTMLAudioElement>(null);
  const playAttackIfNeed = useCallback(() => {
    if (attackWithVideo && attackRef.current) {
      attackRef.current.currentTime = 0;
      attackRef.current.play();
    }
  }, [attackWithVideo])

  return (
    <div className="App">
      <section>
        <h3>プリセットを読み込む</h3>
        {/* <button onClick={() => {
          localStorage.setItem('data', techconf2024);
          setFiles(JSON.parse(techconf2024))
        }}>Tech Conf 2024</button> */}
        <h3>ファイルを登録する</h3>
        <input type='file' multiple onChange={onChangeFiles}/>
        <h3>
          保存済みのファイルを登録する
        </h3>
        <form onSubmit={handleSelectFile}>
          <select ref={fileSelectRef}>
            <option value='NEWTON.mp4'>NEWTON.mp4</option>
            <option value='brand.mp4'>brand.mp4</option>
            <option value='minna_no_market.mp4'>minna_no_market.mp4</option>
            <option value='nishiyama-interview.mp4'>nishiyama-interview.mp4</option>
            <option value='pastak-interview.mp4'>pastak-interview.mp4</option>
            <option value='daiiz-interview.mp4'>daiiz-interview.mp4</option>
            <option value='siroca.mp4'>siroca.mp4</option>
            <option value='help-ape01.mp4'>help-ape01.mp4</option>
            <option value='help-ape-EC.mp4'>help-ape-EC.mp4</option>
            <option value='helpfeel-com-op-info.mp4'>helpfeel-com-op-info.mp4</option>
            <option value='Helpfeel_community_digest.mp4'>Helpfeel_community_digest.mp4</option> 
            <option value='techconf2024-coming.mp4'>techconf2024-coming.mp4</option>
          </select>
          <button>追加</button>
        </form>
        <h3>お知らせを挿入する</h3>
        <button onClick={handleInsertNotice}>挿入する</button>
        <h3>スポンサー表示を挿入する</h3>
        <button onClick={handleInsertSponsors}>挿入する</button>
        <h3>蓋画像を表示する</h3>
        <button onClick={() => setFiles(prev => {
          const data = [...prev, {
            id: crypto.randomUUID(),
            type: 'futa' as const
          }];
          localStorage.setItem('data', JSON.stringify(data));
          return data;
        })}>蓋画像を追加</button>
        <h3>URLを登録する</h3>
        <form onSubmit={onTextEnter}><input type='text' ref={textRef}/></form>
        <h3>登録されたコンテンツ一覧</h3>
        <ol>
        {
          files.map((file) => <li key={file.id}>
            <Preview file={file} deleteFile={generateDeleteFunc(file.id)} />
            <span>{
            // @ts-expect-error
            URL.parse(location.origin + file.url)?.pathname.split('/').pop() ?? ''
            }</span>
            <button onClick={generateDeleteFunc(file.id)}>Delete</button>
          </li>)
        }
        </ol>
        <h3>再生する</h3>
          <button onClick={play('primary') || (() => console.log('aaaa'))}>Play on Primary Window</button>
          <button onClick={play('secondary')}>Play on Secondary Window</button>
          <a href={`${baseUrl}player.html?senario=${JSON.stringify(files)}`} target="_blank">Open New Tab</a>
      </section>
      {
        windowProxy && <section>
          <h3>画面切り替え</h3>
          <button onClick={() => windowProxy.postMessage({action: 'futa'})}>蓋画像を表示する</button>
          <button onClick={() => windowProxy.postMessage({action: 'default'})}>動画ループに戻す</button>
          <button onClick={() => windowProxy.postMessage({action: 'reload'})}>再読み込み</button>
          <hr />
          <h3>Opening</h3>
          <audio controls src="/op.mp3" />
          <h3>Attack</h3>
          <audio controls src="/attack.mp3" ref={attackRef} />
          <p>
            <label>
            <input type="checkbox" onChange={(e) => setAttackWithVideo(e.target.checked)} checked={attackWithVideo} />
            映像開始と同時にアタックを流す
            </label>
          </p>
          <hr />
          <h3>東軍</h3>
          <button onClick={() => {windowProxy.postMessage({
            action: 'injection', file: 'https://i.gyazo.com/5e3312d0ae86792972e15cb2a578115d.mp4'
            }); playAttackIfNeed();}}>イントロ</button>
          <button onClick={() => {windowProxy.postMessage({
            action: 'injection', file: 'https://i.gyazo.com/6baa4154bf687d55af9f7e2ae7c40a9e.mp4'
            }); playAttackIfNeed();}}>先鋒 kazzix</button>
          <button onClick={() => {windowProxy.postMessage({
            action: 'injection', file: 'https://i.gyazo.com/6eeec90ba57dc714b53d51a16d706562.mp4'
            }); playAttackIfNeed();}}>次鋒 chobishiba</button>
          <button onClick={() => {windowProxy.postMessage({
            action: 'injection', file: 'https://i.gyazo.com/8d56119d6ffa3b5456d2a6c82eb93587.mp4'
            }); playAttackIfNeed();}}>中堅 toshio maki</button>
          <button onClick={() => {windowProxy.postMessage({
            action: 'injection', file: 'https://i.gyazo.com/cbd778c17ea34caaba09934a0ffe91ec.mp4'
            }); playAttackIfNeed();}}>副将 kinoppyd</button>
          <button onClick={() => {windowProxy.postMessage({
            action: 'injection', file: 'https://i.gyazo.com/631d9b0b459a52dd215bb9500375612c.mp4'
            }); playAttackIfNeed();}}>大将 ko1</button>
          <button onClick={() => {windowProxy.postMessage({
            action: 'injection', file: 'https://i.gyazo.com/3fe668d624cf586724b3c707e1e37272.mp4'
            }); playAttackIfNeed();}}>東軍出陣</button>
          <hr />
          <h3>西軍</h3>
          <button onClick={() => {windowProxy.postMessage({
            action: 'injection', file: 'https://i.gyazo.com/48dd08fda6949326ed55eb55470cca64.mp4'
            }); playAttackIfNeed();}}>イントロ</button>
          <button onClick={() => {windowProxy.postMessage({
            action: 'injection', file: 'https://i.gyazo.com/86ed9219806ac187f0dd277f34b92a50.mp4'
            }); playAttackIfNeed();}}>先鋒 森塚</button>
          <button onClick={() => {windowProxy.postMessage({
            action: 'injection', file: 'https://i.gyazo.com/9ebcb9deebb1105e2f00b2faa45136b6.mp4'
            }); playAttackIfNeed();}}>次鋒 S.H.</button>
          <button onClick={() => {windowProxy.postMessage({
            action: 'injection', file: 'https://i.gyazo.com/96a39c46624995efa4d775d2a800dd8a.mp4'
            }); playAttackIfNeed();}}>中堅 pocke</button>
          <button onClick={() => {windowProxy.postMessage({
            action: 'injection', file: 'https://i.gyazo.com/0da8316f149071619ab8123fcacee8d2.mp4'
            }); playAttackIfNeed();}}>副将 hasumikin</button>
          <button onClick={() => {windowProxy.postMessage({
            action: 'injection', file: 'https://i.gyazo.com/3cd4e200a43e8e64eeb613a1a17d5fcb.mp4'
            }); playAttackIfNeed();}}>大将 shugo</button>
            <button onClick={() => {windowProxy.postMessage({
            action: 'injection', file: 'https://i.gyazo.com/16a008edd5f4b9a352f8f0b0420941c6.mp4'
            }); playAttackIfNeed();}}>西軍出陣</button>
          <hr />
          <button onClick={() => {windowProxy.postMessage({
            action: 'injection', file: 'https://i.gyazo.com/bda029a62cbacaa2b36542a94110ba08.mp4'
            }); playAttackIfNeed();}}>まつもとさん開戦</button>
        </section>
      }
    </div>
  )
}

export default App
