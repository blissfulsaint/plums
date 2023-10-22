import Card from '../components/Card';

export default function Home() {
  return (
    <main>
      <h1 className="m-5 text-cyan-200">Hello World!</h1>
      <Card title="Card 1" content="This is the content of Card 1" />
      <Card title="Card 2" content="This is the content of Card 2" />
    </main>
  );
}