package com.ruoyi;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

public class WordGenerate {
	
	
	static Map<String, List<String>> readFile(String filename, List<String> list) {
		File file = new File(filename);
		Map<String, List<String>> subMap = null;
		
		if(file.exists()) {
			BufferedReader br = null;
			try {
				br = new BufferedReader(new FileReader(file));
				String line = null;
				String title = null;
				List<String> tmplist = null;
				subMap = new HashMap<String, List<String>>();
				while((line = br.readLine())!=null) {
					if(line.startsWith("TITLE")) {
						title = line.trim().replace("TITLE ", "");
						list.add(title);
						tmplist = new ArrayList<String>();
						subMap.put(title, tmplist);
						
					}else {
						tmplist.add(line.trim());
					}
				}
			} catch (FileNotFoundException e) {
				e.printStackTrace();
			} catch(IOException ioe) {
				ioe.printStackTrace();
			}finally {
				try {
					if(br!=null)
						br.close();
				} catch (Exception e) {
				}
			}
		}
		return subMap;
	}
	
	static void writeJson(Map<String, List<String>> data, List<String> list) {
		if(data!=null && list != null) {
			String titles[] = null;
			
			JSONObject jsonObj = new JSONObject();
			JSONArray array = null;
			JSONObject obj = null;
			JSONArray parent = new JSONArray();
			
			List<String> lines = null;
			String tmp = null;
			for(String title : list) {
				if(title.indexOf("-")>0) {
					titles = title.split("-");
					jsonObj = new JSONObject();
					jsonObj.put("title", titles[0]);
					
					lines = data.get(title);
					array = new JSONArray();
					for(String line: lines) {
						if(line!=null && line.trim().equals("")) {
							continue;
						}
						obj = new JSONObject();
						tmp = line.substring(line.lastIndexOf(" ")+1);
						obj.put("cn", tmp.trim());
						System.out.println("line::"+line);
						tmp = line.substring(0, line.lastIndexOf(" "));
						obj.put("en", tmp.trim());
						obj.put("pic", tmp.trim());
						array.add(obj);
					}
					jsonObj.put("list", array);
					
				}else {
					continue;
				}
				
				parent.add(jsonObj);
			}
			
			System.out.println("json:::"+parent.toString());
			
			
		}
	}
	
	public static void main(String[] args) {
		System.out.println("sssssssssssss");
		List<String> list = new ArrayList<String>();
		Map<String, List<String>> data = readFile("E:\\work\\edu\\tmp.txt", list);
		writeJson(data, list);
	}

}
