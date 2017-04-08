#include <iostream>
#include <fstream>
#include <string>
#include <sstream>
#include <time.h>

using namespace std;

struct station{
	int id;
	int start;
	int end;
	
	string name;
	
	float latitude;
	float longitude;
	
	int docks;
	
	string area;
	
	string installation;
	
	int dhistoryStart[7][24];
	int dhistoryEnd[7][24];
	
	int whistoryStart[7];
	int yhistoryStart[365];
	
	int whistoryEnd[7];
	int yhistoryEnd[365];
};

struct dataPoint{
	int startStation;
	int startwday;
	int startyday;
	int starthour;

	int endStation;
	int endwday;
	int endyday;
	int endhour;
};

dataPoint findSubjects(string);
void printStations(station*);

int main(){
	string line;
	int index = 0;
	
	station stations[100];
	
	ifstream myfile ("201608_trip_data.csv");
	
	for(int i = 0; i < 100; i ++){
		stations[i].id = -1;
		stations[i].start = 0;
		stations[i].end = 0;
		
		for(int j = 0; j < 7; j ++){
			stations[i].whistoryStart[j] = 0;
			stations[i].whistoryEnd[j] = 0;
			
			for(int k = 0; k < 24; k++){
				stations[i].dhistoryStart[j][k] = 0;
				stations[i].dhistoryEnd[j][k] = 0;
			}
		}
		
		for(int j = 0; j < 365; j ++){
			stations[i].yhistoryStart[j] = 0;
			stations[i].yhistoryEnd[j] = 0;
		}
	}
	
	dataPoint data;
	
	if(myfile.is_open()){
		getline(myfile, line);
		
		while( getline(myfile, line) ){
//			getline(myfile, line);
			if(line.length() > 0){
				data = findSubjects(line);
				
				if(stations[data.startStation].id == -1){
					stations[data.startStation].id = data.startStation;
				}
				
				stations[data.startStation].start ++;
				stations[data.startStation].whistoryStart[data.startwday] ++;
				stations[data.startStation].yhistoryStart[data.startyday] ++;
				stations[data.startStation].dhistoryStart[data.startwday][data.starthour] ++;
				
				if(stations[data.endStation].id == -1){
					stations[data.endStation].id = data.endStation;
				}
				
				stations[data.endStation].end ++;
				stations[data.endStation].whistoryEnd[data.endwday] ++;
				stations[data.endStation].yhistoryEnd[data.endyday] ++;
				stations[data.endStation].dhistoryEnd[data.endwday][data.endhour] ++;
				
				index ++;
			}	
		}
	}
	else{
		cout << "Fail infile" << endl;
	}
	
	myfile.close();
	
	
	
	
	
	
	
	
	
	ifstream myfile2("201608_station_data.csv");
	
	if(myfile2.is_open()){
		getline(myfile2, line);
		
		while( getline(myfile2, line) ){
			if(line.length() > 10){
				stringstream ss(line);
				
				int station;
				
				string substr;
				
				getline( ss, substr, ',');
				station = stoi(substr, NULL);
				
				getline( ss, substr, ',');
				stations[station].name = substr;
				
				getline( ss, substr, ',');
				stations[station].latitude = stof(substr);
				
				getline( ss, substr, ',');
				stations[station].longitude = stof(substr);
				
				getline( ss, substr, ',');
				stations[station].docks = stoi(substr, NULL);
				
				getline( ss, substr, ',');
				stations[station].area = substr;
				
				getline( ss, substr);
				stations[station].installation = substr;
			}
		}
	}
	else{
		cout << "Fail infile2" << endl;
	}
	
	myfile2.close();
	
	
	
	
	
	
	
	
	ofstream outfile("bikedata.json");
	
	bool start = true;
	
	if(outfile.is_open()){
		outfile << "[";
		for(int i = 0; i < 100; i ++){
			if(stations[i].id >= 0){
				if(!start){
					outfile << "," << endl << endl ;	
				}
				else{
					start = false;
				}
				outfile << "{";
				outfile << "\"stationId\": " << stations[i].id << ',' << endl;
				outfile << "\"latitude\": " << stations[i].latitude << ',' << endl;
				outfile << "\"longitude\": " << stations[i].longitude << ',' << endl;
				
				outfile << "\"name\": \"" << stations[i].name << "\"," << endl;
				outfile << "\"area\": \"" << stations[i].area << "\"," << endl;
				
				outfile << "\"docks\": " << stations[i].docks << ',' << endl;
				outfile << "\"installation\": \"" << stations[i].installation << "\"," << endl;
				
				outfile << "\"startFreq\": " << stations[i].start << ',' << endl;
				outfile << "\"endFreq\": " << stations[i].end << ',' << endl;
				
				
				outfile << "\"dhistorystart\": [";
				
				for(int j = 0; j < 7; j ++){
					outfile << "[";
					for(int k = 0; k < 24; k++){
						outfile << stations[i].dhistoryStart[j][k];
						if(k < 23) outfile << ',';
					}
					outfile << "]";
					if(j < 6) outfile << ',' << endl;
				}
				
				
				outfile << "]," << endl << "\"dhistoryend\": [";
				
				for(int j = 0; j < 7; j ++){
					outfile << "[";
					for(int k = 0; k < 24; k++){
						outfile << stations[i].dhistoryEnd[j][k];
						if(k < 23) outfile << ',';
					}
					outfile << "]";
					if(j < 6) outfile << ',' << endl;
				}
				
				
				
				outfile << "]," << endl << "\"whistorystart\": [";
				
				for(int j = 0; j < 7; j ++){
					outfile << stations[i].whistoryStart[j];
					if(j < 6) outfile << ',';
				}
				
				outfile << "]," << endl << "\"whistoryend\": [";
				
				for(int j = 0; j < 7; j ++){
					outfile << stations[i].whistoryEnd[j];
					if(j < 6) outfile << ',';
				}
				
				outfile << "]," << endl << "\"yhistorystart\": [";
	
				for(int j = 0; j < 365; j ++){
					outfile << stations[i].yhistoryStart[j];
					if(j < 364) outfile << ',';
				}
				
				outfile << "]," << endl << "\"yhistoryend\": [";
				
				for(int j = 0; j < 365; j ++){
					outfile << stations[i].yhistoryEnd[j];
					if(j < 364) outfile << ',';
				}
				
				outfile << "]" << endl << "}";
			}
		}
		outfile << "]";
	}
	else{
		cout << "Fail outfile" << endl;
	}
	
	outfile.close();
	
//	printStations(stations);
	
	return 0;
}

dataPoint findSubjects(string line){

	struct tm * timeinfo;

	int month;
	int day;
	int year;
	int hour;
	int minute;
	
	int station;


	dataPoint result;
	stringstream ss(line);
	
	string substr;
	
	getline( ss, substr, ',');
//	cout << substr << ' ';
	
	getline( ss, substr, ',');
//	cout << substr << ' ';
	
	getline( ss, substr, '/');
	month = stoi(substr, NULL);
//	cout << month << ' ';
	
	getline( ss, substr, '/');
	day = stoi(substr, NULL);
//	cout << day << ' ';
	
	getline( ss, substr, ' ');
	year = stoi(substr, NULL);
//	cout << year << ' ';
	
	getline( ss, substr, ':');
	hour = stoi(substr, NULL);
//	cout << hour << ' ';
	
	getline( ss, substr, ',');
//	minute = stoi(substr, NULL);
//	cout << minute << ' ';
	
	timeinfo->tm_sec = 0;
	timeinfo->tm_min = 0;
	timeinfo->tm_hour = hour;

	timeinfo->tm_year = year - 1900;
	timeinfo->tm_mon = month - 1;
	timeinfo->tm_mday = day;

	mktime ( timeinfo );
	
//	cout << timeinfo->tm_wday << ' ' << timeinfo->tm_yday << ' ';
	
	getline( ss, substr, ',');
	getline( ss, substr, ',');
	station = stoi(substr, NULL);;
//	cout << station << ' ';
	
	result.startStation = station;
	result.startwday = timeinfo->tm_wday;
	result.startyday = timeinfo->tm_yday;
	result.starthour = hour;
	
	
	
	getline( ss, substr, '/');
	month = stoi(substr, NULL);
//	cout << month << ' ';
	
	getline( ss, substr, '/');
	day = stoi(substr, NULL);
//	cout << day << ' ';
	
	getline( ss, substr, ' ');
	year = stoi(substr, NULL);
//	cout << year << ' ';
	
	getline( ss, substr, ':');
	hour = stoi(substr, NULL);
//	cout << hour << ' ';
	
	getline( ss, substr, ',');
//	minute = stoi(substr, NULL);
//	cout << minute << ' ';
	
	timeinfo->tm_sec = 0;
	timeinfo->tm_min = 0;
	timeinfo->tm_hour = hour;

	timeinfo->tm_year = year - 1900;
	timeinfo->tm_mon = month - 1;
	timeinfo->tm_mday = day;

	mktime ( timeinfo );
	
//	cout << timeinfo->tm_wday << ' ' << timeinfo->tm_yday << ' ';
	
	
	getline( ss, substr, ',');
	getline( ss, substr, ',');
	station = stoi(substr, NULL);;
//	cout << station << ' ';
	
	result.endStation = station;
	result.endwday = timeinfo->tm_wday;
	result.endyday = timeinfo->tm_yday;
	result.endhour = hour;
	

	return result;
}

void printStations(station* stations){
	for(int i = 0; i < 100; i ++){
		
		if(stations[i].id >= 0){
			cout << stations[i].id << ' ';
			cout << stations[i].start << ' ';
			cout << stations[i].end << ' ';
			
			cout << endl;
			
			for(int j = 0; j < 7; j ++){
				cout << stations[i].whistoryStart[j] << ' ';
			}
			
			cout << endl;
			
			for(int j = 0; j < 7; j ++){
				cout << stations[i].whistoryEnd[j] << ' ';
			}
			
			cout << endl << endl;
			/*
			for(int j = 0; j < 365; j ++){
				cout << stations[i].yhistoryStart[j] << ' ';
			}
			
			cout << endl << endl;
			
			for(int j = 0; j < 365; j ++){
				cout << stations[i].yhistoryEnd[j] << ' ';
			}
			
			cout << endl << endl;*/
		}
	}
}
