import { ChatProvider } from './ChatContext';
import { ChatComponent } from './ChatComponent';

function App() {
    return (
        <ChatProvider>
            <ChatComponent />
        </ChatProvider>
    );
}

export default App;