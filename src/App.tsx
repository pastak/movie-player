import { useRef, useState } from 'react'
import './App.css'
import { FileInfo } from './libs/files'
import { getWindowManagementPermissionState } from './libs/multiWindow'



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
    }} />
  } else {
    return <span>{file.url}</span>
  }
}

function App() {
  const [files, setFiles] = useState<FileInfo[]>(JSON.parse(localStorage.getItem('data') || '[]') || []);

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

  const play = (type: 'primary' | 'secondary') => async () => {
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
          `scrollbars=no`
        ].join(",");
        window.open(`/player.html?senario=${JSON.stringify(files)}`, Math.random().toString(), features);
      }
    } catch {
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
        url: encodeURIComponent('/slide.html?type=notice&number=0'),
        id: crypto.randomUUID(),
        type: 'website' as const
      },{
        url: encodeURIComponent('/slide.html?type=notice&number=1'),
        id: crypto.randomUUID(),
        type: 'website' as const
      },{
        url: encodeURIComponent('/slide.html?type=timetable'),
        id: crypto.randomUUID(),
        type: 'website' as const
      }];
      localStorage.setItem('data', JSON.stringify(data));
      return data;
    })
  }

  return (
    <div className="App">
      <section>
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
            <option value='raksul.mp4'>raksul.mp4</option>
            <option value='nishiyama-interview.mp4'>nishiyama-interview.mp4</option>
            <option value='pastak-interview.mp4'>pastak-interview.mp4</option>
            <option value='daiiz-interview.mp4'>daiiz-interview.mp4</option>
            <option value='siroca.mp4'>siroca.mp4</option>
            <option value='TechConfAfterMovie.mp4'>TechConfAfterMovie.mp4</option>
          </select>
          <button>追加</button>
        </form>
        <h3>お知らせを挿入する</h3>
        <button onClick={handleInsertNotice}>挿入する</button>
        <h3>URLを登録する</h3>
        <form onSubmit={onTextEnter}><input type='text' ref={textRef}/></form>
        <h3>登録されたコンテンツ一覧</h3>
        <ol>
        {
          files.map((file) => <li key={file.id}><Preview file={file} deleteFile={generateDeleteFunc(file.id)} /><button onClick={generateDeleteFunc(file.id)}>Delete</button></li>)
        }
        </ol>
        <h3>再生する</h3>
          <button onClick={play('primary')}>Play on Primary Window</button>
          <button onClick={play('secondary')}>Play on Secondary Window</button>
          <a href={`/player.html?senario=${JSON.stringify(files)}`} target="_blank">Open New Tab</a>
      </section>
    </div>
  )
}

export default App
