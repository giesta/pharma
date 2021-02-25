<?php
namespace App\Services;
use Goutte\Client;
use Symfony\Component\HttpClient\HttpClient;
class ScraperService
{
    /**
     * Make a call to to specified url and return formatted data
     * 
     * @param string $url
     * 
     * @return array
     */
    public function scrap($url)
    {
        $client  = new Client(HttpClient::create(['timeout' => 60]));
        $crawler = $client->request('GET', $url);
       //Get the symptoms part 1
        $symptoms = $crawler->filter('.row_1')->each(function ($node) {
            return $node->text();
        });
        
        //Get symptoms part 2
        $symptoms2 = $crawler->filter('.row_2')->each(function ($node) {
            return $node->text();
        });
       
      return array_merge($symptoms, $symptoms2);
    }
}