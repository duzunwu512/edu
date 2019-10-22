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
	
	//catalog-words.txt
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
						System.out.println("title::"+title);
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
						tmp = line.substring(0, line.lastIndexOf(" "));
						obj.put("en", tmp.trim());
						obj.put("pic", "");
						array.add(obj);
					}
					System.out.println("title:"+ titles[0]+" size:"+array.size());
					jsonObj.put("list", array);
					
				}else {
					continue;
				}
				
				parent.add(jsonObj);
			}
			
		}
	}
	
	
	//人教版新起点1-6年级单词表.txt
	static Map<String, List<String>> readNewStartFile(String filename) {
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
				
				StringBuffer sb = new StringBuffer();
				
				String g = null;
				String u = null;
				String cn = null;
				String en = null;
				int grade = 0;
				int unit = 0;
				boolean nword = true;
				boolean newu = true;
				boolean newue=false;
				while((line = br.readLine())!=null) {
					if(line.startsWith("//")){//跳出第一行的 人教版新起点
						continue;
					}
					line = line.trim();
					if(line.startsWith("-")) {//如果是年级
						grade++;
						unit = 0;
						g = line.trim().replace("-", "");
						System.out.println("title::"+g);
						
					}else if(line.startsWith("=")) {
						unit++;
						newu = true;
						if(newue){
							sb.append("]\n").append("};\n");
							newue = false;
						}
						u = line.trim().replace("=", "");
						//System.out.println("title::"+u);
						sb.append("var ").append("g").append(grade).append("_").append("u").append(unit).append(" = {\n")
						.append("  title:'").append(u).append("',\n");
						
					}else {//如果是单词内容
						line = line.trim();
						cn = line.substring(line.lastIndexOf(" ")+1);
						en = line.replace(cn, "").trim();
						if(newu){
							sb.append("  list:[");
							newu = !newu;
							newue = true;
						}
						sb.append("{en:'").append(en).append("', cn:'").append(cn).append("'},");
					}
					
				}
				sb.append("]\n").append("};\n");
				System.out.println(""+sb.toString());
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
	
	public static void main(String[] args) {
		System.out.println("sssssssssssss");
		List<String> list = new ArrayList<String>();
		Map<String, List<String>> data = readFile("G:\\project\\code\\RuoYi\\ruoyi-admin\\src\\main\\resources\\data\\catalog-words.txt", list);
		writeJson(data, list);
		
//		readNewStartFile("G:\\project\\code\\RuoYi\\ruoyi-admin\\src\\main\\resources\\data\\人教版新起点1-6年级单词表.txt");
	}

}
